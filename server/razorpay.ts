import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error("Razorpay keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.");
  }
  
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });
  }
  
  return razorpayInstance;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(razorpayKeyId && razorpayKeySecret);
}

export function getKeyId(): string | undefined {
  return razorpayKeyId;
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
  if (!razorpayKeySecret) {
    throw new Error("Razorpay key secret not configured");
  }
  
  const body = params.razorpay_order_id + "|" + params.razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(body)
    .digest("hex");
  
  return expectedSignature === params.razorpay_signature;
}

export async function fetchPaymentDetails(paymentId: string) {
  const razorpay = getRazorpay();
  return razorpay.payments.fetch(paymentId);
}
