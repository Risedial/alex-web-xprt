import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log(
      `PaymentIntent ${paymentIntent.id} succeeded: ${paymentIntent.amount} ${paymentIntent.currency}`
    );
  }

  return NextResponse.json({ received: true });
}
