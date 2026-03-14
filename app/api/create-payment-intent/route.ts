import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';

export async function POST(request: Request) {
  const { amount, currency } = await request.json();
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
  });
  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
