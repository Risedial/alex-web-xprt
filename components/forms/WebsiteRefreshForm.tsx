'use client';

import { useEffect, useState } from 'react';
import MultiStepForm from '@/components/forms/MultiStepForm';
import FormField from '@/components/forms/FormField';
import StripePaymentStep from '@/components/forms/StripePaymentStep';

const TERMS_TEXT =
  'Scope: Full redesign, updated content, mobile-friendly, same domain. Timeline: 1–2 weeks from completed form + deposit. Pricing: $1,000–$2,500; deposit $500; balance before launch. Revisions: One round; additional $150. Guarantee: Not happy after first draft → revise until satisfied or full deposit refund. Ownership: You own everything.';

const REQUIRED_FIELDS: Record<number, string[]> = {
  0: ['websiteUrl', 'currentPlatform', 'whatYouDislike', 'mobileWorking'],
  1: ['refreshGoal', 'brandingChanges'],
  2: ['hasLoginAccess', 'termsAgreed'],
  3: [],
};

function InlineError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-500 -mt-3 mb-4">{message}</p>;
}

export default function WebsiteRefreshForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidationErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleNext = () => {
    if (currentStep === 3) return;
    const required = REQUIRED_FIELDS[currentStep] ?? [];
    const errors: Record<string, string> = {};
    for (const field of required) {
      const val = formData[field];
      if (val === undefined || val === null || val === '' || val === false) {
        errors[field] = 'This field is required.';
      }
    }
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  // Keyboard navigation — re-registers when step or formData changes to keep closure fresh
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === 'Enter' && target.tagName !== 'TEXTAREA') {
        handleNext();
      }
      if (e.key === 'Escape') {
        handleBack();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, formData]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsSubmitting(true);
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'Website Refresh',
          fields: formData,
          paymentIntentId,
          uploadedFiles,
        }),
      });
      setIsComplete(true);
    } catch {
      setError(
        'Payment was received but notification failed. Please email alex@alexanderbitarservices.com with your submission.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
  };

  if (isComplete) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-700">
          Got it — I&apos;ll be in touch within a few hours. If you have any questions in the
          meantime, just email me at{' '}
          <a
            href="mailto:alex@alexanderbitarservices.com"
            className="text-blue-600 underline"
          >
            alex@alexanderbitarservices.com
          </a>
        </p>
      </div>
    );
  }

  // Step 0 — Your Current Site
  const step0 = (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Current Site</h2>
      <FormField
        type="text"
        label="Your website URL"
        required
        value={formData.websiteUrl ?? ''}
        onChange={(v) => updateField('websiteUrl', v)}
      />
      <InlineError message={validationErrors.websiteUrl} />
      <FormField
        type="single-select"
        label="What platform is your site on?"
        required
        options={['WordPress', 'Wix', 'Squarespace', 'Shopify', "I don't know", 'Other']}
        value={formData.currentPlatform ?? ''}
        onChange={(v) => updateField('currentPlatform', v)}
      />
      <InlineError message={validationErrors.currentPlatform} />
      <FormField
        type="textarea"
        label="What do you like about your current site?"
        helperText="Anything you want to keep"
        value={formData.whatYouLike ?? ''}
        onChange={(v) => updateField('whatYouLike', v)}
      />
      <FormField
        type="textarea"
        label="What do you NOT like about your current site?"
        required
        helperText="What's embarrassing, broken, outdated?"
        value={formData.whatYouDislike ?? ''}
        onChange={(v) => updateField('whatYouDislike', v)}
      />
      <InlineError message={validationErrors.whatYouDislike} />
      <FormField
        type="single-select"
        label="Does your site work well on phones?"
        required
        options={['Yes', 'No', "I haven't checked"]}
        value={formData.mobileWorking ?? ''}
        onChange={(v) => updateField('mobileWorking', v)}
      />
      <InlineError message={validationErrors.mobileWorking} />
    </div>
  );

  // Step 1 — What You Want
  const step1 = (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">What You Want</h2>
      <FormField
        type="textarea"
        label="What should the refreshed site achieve?"
        required
        helperText="More calls? More credibility? Show up in Google?"
        value={formData.refreshGoal ?? ''}
        onChange={(v) => updateField('refreshGoal', v)}
      />
      <InlineError message={validationErrors.refreshGoal} />
      <FormField
        type="textarea"
        label="Any new services or content to add?"
        value={formData.newContent ?? ''}
        onChange={(v) => updateField('newContent', v)}
      />
      <FormField
        type="single-select"
        label="Any branding changes?"
        required
        options={['Keep current', 'I have new branding', 'I need branding help']}
        value={formData.brandingChanges ?? ''}
        onChange={(v) => updateField('brandingChanges', v)}
      />
      <InlineError message={validationErrors.brandingChanges} />
      <FormField
        type="file"
        label="Upload any new files"
        helperText="New logo, photos, content"
        value={formData.fileUpload ?? ''}
        onChange={(v) => updateField('fileUpload', v)}
        onFileUploaded={(fieldName, url) =>
          setUploadedFiles((prev) => ({ ...prev, [fieldName]: url }))
        }
        fieldName="fileUpload"
      />
      <FormField
        type="textarea"
        label="Websites you like the look of?"
        value={formData.websitesYouLike ?? ''}
        onChange={(v) => updateField('websitesYouLike', v)}
      />
    </div>
  );

  // Step 2 — Logistics & Agreement
  const step2 = (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Logistics &amp; Agreement</h2>
      <FormField
        type="single-select"
        label="Do you have login access to your current site?"
        required
        options={['Yes', 'No', "I'm not sure"]}
        value={formData.hasLoginAccess ?? ''}
        onChange={(v) => updateField('hasLoginAccess', v)}
      />
      <InlineError message={validationErrors.hasLoginAccess} />
      <FormField
        type="text"
        label="Is there a deadline?"
        value={formData.deadline ?? ''}
        onChange={(v) => updateField('deadline', v)}
      />
      <FormField
        type="textarea"
        label="Anything else I should know?"
        value={formData.additionalInfo ?? ''}
        onChange={(v) => updateField('additionalInfo', v)}
      />
      <FormField
        type="text-block"
        label="Project Terms"
        value={TERMS_TEXT}
        onChange={() => {}}
      />
      <FormField
        type="checkbox"
        label="I agree to the project terms above."
        required
        value={formData.termsAgreed ?? false}
        onChange={(v) => updateField('termsAgreed', v)}
      />
      <InlineError message={validationErrors.termsAgreed} />
    </div>
  );

  // Step 3 — Payment
  const step3 = (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Pay your deposit</h2>
      <StripePaymentStep
        amount={50000}
        currency="usd"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );

  const steps = [step0, step1, step2, step3];

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Let&apos;s Refresh Your Website</h1>
        <p className="text-gray-500 mt-1">
          Takes about 10 minutes. The more detail you share, the faster I can get started.
        </p>
      </div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}
      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        totalSteps={4}
        onNext={handleNext}
        onBack={handleBack}
        isLastStep={currentStep === 3}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
