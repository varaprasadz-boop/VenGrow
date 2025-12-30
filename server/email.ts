import nodemailer from "nodemailer";
import { storage } from "./storage";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

let transporter: nodemailer.Transporter | null = null;
let emailConfig: EmailConfig | null = null;

async function getEmailConfig(): Promise<EmailConfig | null> {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return null;
    }

    const port = parseInt(smtpPort || "587", 10);
    return {
      host: smtpHost,
      port: port,
      secure: port === 465,
      user: smtpUser,
      pass: smtpPass,
      from: smtpFrom || `VenGrow <${smtpUser}>`,
    };
  } catch (error) {
    console.log("[Email] Failed to get SMTP config:", error);
    return null;
  }
}

async function getTransporter(): Promise<nodemailer.Transporter | null> {
  if (transporter) return transporter;

  const config = await getEmailConfig();
  if (!config) {
    console.log("[Email] SMTP not configured - emails will be logged only");
    return null;
  }

  emailConfig = config;
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return transporter;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function replaceVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    // Escape HTML in variables for security (XSS prevention)
    const escapedValue = escapeHtml(value || "");
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, escapedValue);
  }
  return result;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const transport = await getTransporter();
  
  if (!transport || !emailConfig) {
    console.log("[Email] SMTP not configured. Would send email:");
    console.log(`  To: ${options.to}`);
    console.log(`  Subject: ${options.subject}`);
    console.log(`  Preview: ${options.html.substring(0, 200)}...`);
    return false;
  }

  try {
    const result = await transport.sendMail({
      from: emailConfig.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]+>/g, ""),
    });
    console.log(`[Email] Sent successfully to ${options.to}: ${options.subject} (MessageId: ${result.messageId})`);
    return true;
  } catch (error: any) {
    console.error(`[Email] Failed to send to ${options.to}:`, {
      error: error.message,
      code: error.code,
      command: error.command,
      subject: options.subject,
    });
    return false;
  }
}

export async function sendTemplatedEmail(
  triggerEvent: string,
  to: string,
  variables: Record<string, string>
): Promise<boolean> {
  try {
    const templates = await storage.getEmailTemplates();
    const template = templates.find(
      (t) => t.triggerEvent === triggerEvent && t.isActive
    );

    if (!template) {
      console.warn(`[Email] No active template found for trigger: ${triggerEvent}. Email not sent to ${to}`);
      // Optionally send a fallback plain text email for critical events
      if (["welcome_buyer", "welcome_seller", "property_approved", "payment_success"].includes(triggerEvent)) {
        console.log(`[Email] Attempting fallback email for critical event: ${triggerEvent}`);
        const fallbackSubject = `Notification from VenGrow - ${triggerEvent}`;
        const fallbackBody = `<p>This is an automated notification from VenGrow.</p><p>Event: ${triggerEvent}</p><p>Please check your dashboard for details.</p>`;
        return await sendEmail({ to, subject: fallbackSubject, html: fallbackBody });
      }
      return false;
    }

    // Validate required variables
    const requiredVars = template.variables || [];
    const missingVars = requiredVars.filter(v => !variables[v]);
    if (missingVars.length > 0) {
      console.warn(`[Email] Missing variables for template ${triggerEvent}: ${missingVars.join(", ")}`);
      // Continue anyway, missing vars will be empty strings
    }

    const subject = replaceVariables(template.subject, variables);
    const html = replaceVariables(template.body, variables);

    return await sendEmail({ to, subject, html });
  } catch (error) {
    console.error(`[Email] Failed to send templated email (${triggerEvent}) to ${to}:`, error);
    return false;
  }
}

export async function sendInquiryNotification(
  sellerEmail: string,
  sellerName: string,
  propertyTitle: string,
  buyerName: string,
  buyerEmail: string,
  buyerPhone: string,
  message: string
): Promise<boolean> {
  return sendTemplatedEmail("inquiry_received", sellerEmail, {
    sellerName,
    propertyTitle,
    buyerName,
    buyerEmail,
    buyerPhone,
    message,
  });
}

export async function sendAppointmentNotification(
  to: string,
  recipientName: string,
  propertyTitle: string,
  dateTime: string,
  otherPartyName: string,
  isForSeller: boolean
): Promise<boolean> {
  // Use template instead of hardcoded HTML
  // For now, use simple template with conditional logic in variables
  const triggerEvent = "appointment_requested";
  const subject = isForSeller 
    ? `New Visit Request for ${propertyTitle}`
    : `Your Visit Request for ${propertyTitle}`;
  
  const html = isForSeller
    ? `<h1>New Visit Request</h1>
       <p>Hi ${escapeHtml(recipientName)},</p>
       <p>You have a new visit request for your property: <strong>${escapeHtml(propertyTitle)}</strong></p>
       <p><strong>Requested by:</strong> ${escapeHtml(otherPartyName)}</p>
       <p><strong>Requested Time:</strong> ${escapeHtml(dateTime)}</p>
       <p>Login to your seller dashboard to accept or reschedule this appointment.</p>
       <p>Best regards,<br>The VenGrow Team</p>`
    : `<h1>Visit Request Submitted</h1>
       <p>Hi ${escapeHtml(recipientName)},</p>
       <p>Your visit request for <strong>${escapeHtml(propertyTitle)}</strong> has been submitted.</p>
       <p><strong>Requested Time:</strong> ${escapeHtml(dateTime)}</p>
       <p>The seller will review your request and confirm the appointment.</p>
       <p>Best regards,<br>The VenGrow Team</p>`;

  return sendEmail({ to, subject, html });
}

export async function sendPropertyStatusNotification(
  sellerEmail: string,
  sellerName: string,
  propertyTitle: string,
  status: "approved" | "rejected" | "live",
  rejectionReason?: string
): Promise<boolean> {
  let triggerEvent: string;
  switch (status) {
    case "approved":
    case "live":
      triggerEvent = "property_approved";
      break;
    case "rejected":
      triggerEvent = "property_rejected";
      break;
    default:
      return false;
  }

  return sendTemplatedEmail(triggerEvent, sellerEmail, {
    sellerName,
    propertyTitle,
    rejectionReason: rejectionReason || "",
  });
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string,
  role: "buyer" | "seller"
): Promise<boolean> {
  const triggerEvent = role === "buyer" ? "welcome_buyer" : "welcome_seller";
  return sendTemplatedEmail(triggerEvent, email, {
    firstName,
    email,
  });
}

export async function sendPaymentNotification(
  sellerEmail: string,
  sellerName: string,
  amount: string,
  packageName: string,
  success: boolean,
  errorMessage?: string
): Promise<boolean> {
  const triggerEvent = success ? "payment_success" : "payment_failed";
  return sendTemplatedEmail(triggerEvent, sellerEmail, {
    sellerName,
    amount,
    packageName,
    errorMessage: errorMessage || "",
    retryLink: "/seller/packages",
  });
}

export async function testSmtpConnection(): Promise<{ success: boolean; message: string }> {
  const transport = await getTransporter();
  
  if (!transport) {
    return { 
      success: false, 
      message: "SMTP not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables." 
    };
  }

  try {
    await transport.verify();
    return { success: true, message: "SMTP connection verified successfully" };
  } catch (error: any) {
    return { success: false, message: `SMTP verification failed: ${error.message}` };
  }
}
