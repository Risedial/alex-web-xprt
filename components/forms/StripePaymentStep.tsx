'use client';

import { useEffect, useState } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe-client';

interface StripePaymentStepProps {
  amount: number;
  currency: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

function PaymentForm({
  onSuccess,
  onError,
}: {
  onSuccess: (id: string) => void;
  onError: (err: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required',
    });

    setIsProcessing(false);

    if (result.error) {
      onError(result.error.message ?? 'Payment failed. Please try again.');
    } else if (result.paymentIntent?.status === 'succeeded') {
      onSuccess(result.paymentIntent.id);
    }
  };

  return (
    <div>
      <PaymentElement />
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || !elements || isProcessing}
        style={{ minHeight: '44px', fontSize: '16px' }}
        className="w-full mt-6 bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processing…' : 'Pay'}
      </button>
    </div>
  );
}

export default function StripePaymentStep({
  amount,
  currency,
  onSuccess,
  onError,
}: StripePaymentStepProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setClientSecret(null);
    setFetchError(null);

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to initialize payment. Please refresh and try again.');
        return res.json();
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err: Error) => setFetchError(err.message));
  }, [amount, currency]);

  if (fetchError) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
        {fetchError}
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="py-8 text-center text-gray-500 text-sm">
        Initializing payment…
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
