'use client';

import { useState, useEffect, useCallback } from 'react';
import MultiStepForm from '@/components/forms/MultiStepForm';
import FormField from '@/components/forms/FormField';
import StripePaymentStep from '@/components/forms/StripePaymentStep';

export default function MonthlyMaintenanceForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleNext = useCallback(() => {
    if (currentStep === 2) return;
    const errors: Record<string, string> = {};
    if (currentStep === 0) {
      if (!formData.websiteUrl?.trim()) errors.websiteUrl = 'Required';
      if (!formData.currentPlatform) errors.currentPlatform = 'Required';
      if (!formData.hasAdminAccess) errors.hasAdminAccess = 'Required';
    }
    if (currentStep === 1) {
      if (!formData.updateFrequency) errors.updateFrequency = 'Required';
      if (!formData.planSelection) errors.planSelection = 'Required';
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setCurrentStep((prev) => prev + 1);
  }, [currentStep, formData]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setFieldErrors({});
    }
  }, [currentStep]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === 'Enter' && target.tagName !== 'TEXTAREA') {
        handleNext();
      } else if (e.key === 'Escape') {
        handleBack();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handleBack]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsSubmitting(true);
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'Monthly Maintenance',
          fields: formData,
          paymentIntentId,
          uploadedFiles,
        }),
      });
      setIsComplete(true);
    } catch (err) {
      setError(
        'Payment was received but notification failed. Please email alex@alexanderbitarservices.com with your submission.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (message: string) => {
    setError(message);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-lg text-gray-700">
            Got it — I'll be in touch within a few hours. If you have any questions in the meantime, just email me at{' '}
            <a href="mailto:alex@alexanderbitarservices.com" className="text-blue-600 underline">
              alex@alexanderbitarservices.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  const paymentAmount = formData.planSelection === 'Basic ($75/mo)' ? 7500 : 15000;

  const step0 = (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Your Site</h2>
      <FormField
        type="text"
        label="Your website URL"
        required
        value={formData.websiteUrl ?? ''}
        onChange={(v) => updateField('websiteUrl', v)}
      />
      {fieldErrors.websiteUrl && (
        <p className="text-red-500 text-sm -mt-3 mb-3">{fieldErrors.websiteUrl}</p>
      )}
      <FormField
        type="single-select"
        label="What platform is your site on?"
        required
        options={['WordPress', 'Wix', 'Squarespace', 'Other']}
        value={formData.currentPlatform ?? ''}
        onChange={(v) => updateField('currentPlatform', v)}
      />
      {fieldErrors.currentPlatform && (
        <p className="text-red-500 text-sm -mt-3 mb-3">{fieldErrors.currentPlatform}</p>
      )}
      <FormField
        type="text"
        label="Who is currently hosting your site?"
        helperText="GoDaddy, Bluehost, etc."
        value={formData.currentHost ?? ''}
        onChange={(v) => updateField('currentHost', v)}
      />
      <FormField
        type="single-select"
        label="Do you have admin login access?"
        required
        options={['Yes', 'No', 'Not sure']}
        value={formData.hasAdminAccess ?? ''}
        onChange={(v) => updateField('hasAdminAccess', v)}
      />
      {fieldErrors.hasAdminAccess && (
        <p className="text-red-500 text-sm -mt-3 mb-3">{fieldErrors.hasAdminAccess}</p>
      )}
    </div>
  );

  const step1 = (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Choose Your Plan</h2>
      <FormField
        type="single-select"
        label="How often do you need content changes?"
        required
        options={['Rarely', 'Monthly', 'Weekly']}
        value={formData.updateFrequency ?? ''}
        onChange={(v) => updateField('updateFrequency', v)}
      />
      {fieldErrors.updateFrequency && (
        <p className="text-red-500 text-sm -mt-3 mb-3">{fieldErrors.updateFrequency}</p>
      )}
      <FormField
        type="textarea"
        label="What's your biggest pain point right now?"
        helperText="Slow? Spam? Just want someone to deal with it?"
        value={formData.painPoint ?? ''}
        onChange={(v) => updateField('painPoint', v)}
      />
      <FormField
        type="single-select"
        label="Which plan fits your needs?"
        required
        options={['Basic ($75/mo)', 'Priority ($150/mo)']}
        value={formData.planSelection ?? ''}
        onChange={(v) => updateField('planSelection', v)}
      />
      {fieldErrors.planSelection && (
        <p className="text-red-500 text-sm -mt-3 mb-3">{fieldErrors.planSelection}</p>
      )}
      <FormField
        type="textarea"
        label="Anything else I should know?"
        value={formData.additionalInfo ?? ''}
        onChange={(v) => updateField('additionalInfo', v)}
      />
      <FormField
        type="text-block"
        label="Terms"
        value="Month-to-month. Cancel anytime with 30 days notice. No contracts, no penalties."
        onChange={() => {}}
      />
    </div>
  );

  const step2 = (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Pay your first month</h2>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}
      <StripePaymentStep
        amount={paymentAmount}
        currency="usd"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Keep Your Site Running — I'll Handle It</h1>
          <p className="text-gray-500 mt-1">Quick setup form. Takes about 5 minutes.</p>
        </div>
        <MultiStepForm
          steps={[step0, step1, step2]}
          currentStep={currentStep}
          totalSteps={3}
          onNext={handleNext}
          onBack={handleBack}
          isLastStep={currentStep === 2}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
