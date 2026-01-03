import Razorpay from "razorpay";
import crypto from "crypto";

// Read environment variables at runtime (not at module load time)
function getRazorpayKeyId(): string | undefined {
  return process.env.RAZORPAY_KEY_ID;
}

function getRazorpayKeySecret(): string | undefined {
  return process.env.RAZORPAY_KEY_SECRET;
}

let razorpayInstance: Razorpay | null = null;

function isDummyModeEnabled(): boolean {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  return !keyId || !keySecret;
}

export function getRazorpay(): Razorpay {
  if (isDummyModeEnabled()) {
    throw new Error("Razorpay is in dummy mode");
  }
  
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: getRazorpayKeyId()!,
      key_secret: getRazorpayKeySecret()!,
    });
  }
  
  return razorpayInstance;
}

export function isRazorpayConfigured(): boolean {
  return !isDummyModeEnabled();
}

export function isDummyMode(): boolean {
  return isDummyModeEnabled();
}

export function getKeyId(): string {
  return getRazorpayKeyId() || "rzp_test_dummy";
}

interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  notes: Record<string, string>;
  created_at: number;
}

export async function createOrder(params: CreateOrderParams): Promise<RazorpayOrder> {
  // Check for bypass mode first
  const bypassMode = process.env.PAYMENT_BYPASS_MODE === "true" || 
                     process.env.PAYMENT_BYPASS_MODE === "1" ||
                     process.env.PAYMENT_BYPASS_MODE === "TRUE";
  
  if (bypassMode) {
    // In bypass mode, return a dummy order that indicates bypass was used
    const dummyOrderId = `order_bypass_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      id: dummyOrderId,
      entity: "order",
      amount: params.amount * 100,
      amount_paid: params.amount * 100, // Mark as paid in bypass mode
      amount_due: 0,
      currency: params.currency || "INR",
      receipt: params.receipt,
      status: "paid", // Mark as paid
      notes: { ...params.notes, bypassMode: "true" },
      created_at: Math.floor(Date.now() / 1000),
    };
  }
  
  if (isDummyModeEnabled()) {
    const dummyOrderId = `order_dummy_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      id: dummyOrderId,
      entity: "order",
      amount: params.amount * 100,
      amount_paid: 0,
      amount_due: params.amount * 100,
      currency: params.currency || "INR",
      receipt: params.receipt,
      status: "created",
      notes: params.notes || {},
      created_at: Math.floor(Date.now() / 1000),
    };
  }

  const razorpay = getRazorpay();
  
  const order = await razorpay.orders.create({
    amount: params.amount * 100,
    currency: params.currency || "INR",
    receipt: params.receipt,
    notes: params.notes || {},
  });
  
  return order as RazorpayOrder;
}

interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function verifyPaymentSignature(params: VerifyPaymentParams): boolean {
  if (isDummyModeEnabled()) {
    return true;
  }

  const keySecret = getRazorpayKeySecret();
  if (!keySecret) {
    throw new Error("Razorpay key secret not configured");
  }
  
  const body = params.razorpay_order_id + "|" + params.razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");
  
  return expectedSignature === params.razorpay_signature;
}

export async function fetchPaymentDetails(paymentId: string) {
  if (isDummyModeEnabled()) {
    return {
      id: paymentId,
      entity: "payment",
      amount: 0,
      currency: "INR",
      status: "captured",
      method: "dummy",
      description: "Dummy payment for testing",
      created_at: Math.floor(Date.now() / 1000),
    };
  }
  const razorpay = getRazorpay();
  return razorpay.payments.fetch(paymentId);
}
