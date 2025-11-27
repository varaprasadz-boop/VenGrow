import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpayInstance: Razorpay | null = null;

const DUMMY_MODE = !razorpayKeyId || !razorpayKeySecret;

export function getRazorpay(): Razorpay {
  if (DUMMY_MODE) {
    throw new Error("Razorpay is in dummy mode");
  }
  
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: razorpayKeyId!,
      key_secret: razorpayKeySecret!,
    });
  }
  
  return razorpayInstance;
}

export function isRazorpayConfigured(): boolean {
  return !DUMMY_MODE;
}

export function isDummyMode(): boolean {
  return DUMMY_MODE;
}

export function getKeyId(): string {
  return razorpayKeyId || "rzp_test_dummy";
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
  if (DUMMY_MODE) {
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
  if (DUMMY_MODE) {
    return true;
  }

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
  if (DUMMY_MODE) {
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
