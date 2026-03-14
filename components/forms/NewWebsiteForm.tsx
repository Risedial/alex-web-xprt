'use client';

import { useEffect, useRef, useState } from 'react';
import MultiStepForm from '@/components/forms/MultiStepForm';
import FormField from '@/components/forms/FormField';
import StripePaymentStep from '@/components/forms/StripePaymentStep';

const TERMS_TEXT =
  'Scope: Up to 5 pages, one round of revisions. Additional pages or major scope changes quoted separately. Timeline: 2\u20133 weeks from completed form + deposit. Pricing: $1,500\u2013$3,500; deposit $750 reserves slot; balance due before launch. Revisions: One round included; additional $150 each. Ownership: You own everything. Guarantee: If not live within agreed timeline, credit $150 toward first 3 months maintenance. Cancellation: Full refund if not started; deposit covers time if work begun.';

const REQUIRED_PER_STEP: Record<number, string[]> = {
  0: ['businessName', 'businessDescription', 'typicalCustomers', 'serviceArea', 'websiteGoal'],
  1: ['hasLogo', 'hasBrandColors', 'siteTone', 'pagesNeeded'],
  2: ['domainOwnership', 'hasHosting'],
  3: ['termsAgreed'],
  4: [],
};

export default function NewWebsiteForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  const setField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setStepError(null);
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
    setStepError(null);
  };

  const handleNext = () => {
    if (currentStep === 4) return;

    const required = REQUIRED_PER_STEP[currentStep] ?? [];
    const missing = required.filter((key) => {
      const val = formData[key];
      if (val === undefined || val === null || val === '' || val === false) return true;
      if (Array.isArray(val) && val.length === 0) return true;
      return false;
    });

    if (missing.length > 0) {
      setStepError('Please fill in all required fields before continuing.');
      return;
    }

    setStepError(null);
    setCurrentStep((s) => s + 1);
  };

  // Keep a ref so the keydown handler always calls the latest handleNext/handleBack
  const handleNextRef = useRef(handleNext);
  const handleBackRef = useRef(handleBack);
  useEffect(() => {
    handleNextRef.current = handleNext;
    handleBackRef.current = handleBack;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === 'Escape') {
        handleBackRef.current();
      }
      if (
        e.key === 'Enter' &&
        target.tagName !== 'TEXTAREA' &&
        target.tagName !== 'BUTTON'
      ) {
        handleNextRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsSubmitting(true);
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'New Website',
          fields: formData,
          paymentIntentId,
          uploadedFiles,
        }),
      });
      setIsComplete(true);
    } catch {
      setError(
        'Payment was received but notification failed. Please email alex@alexanderbitarservices.com with your submission.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (err: string) => {
    setError(err);
  };

  if (isComplete) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-700">
          Got it — I&apos;ll be in touch within a few hours. If you have any questions in the
          meantime, just email me at alex@alexanderbitarservices.com
        </p>
      </div>
    );
  }

  const steps = [
    // Step 0 — Your Business
    <div key="step0">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Business</h2>
      <FormField
        type="text"
        label="Business name"
        required
        value={formData.businessName ?? ''}
        onChange={(v) => setField('businessName', v)}
      />
      <FormField
        type="textarea"
        label="What does your business do?"
        required
        helperText="Describe it like you would to someone who's never heard of you."
        value={formData.businessDescription ?? ''}
        onChange={(v) => setField('businessDescription', v)}
      />
      <FormField
        type="textarea"
        label="Who are your typical customers?"
        required
        helperText="Think about who calls or walks in most often."
        value={formData.typicalCustomers ?? ''}
        onChange={(v) => setField('typicalCustomers', v)}
      />
      <FormField
        type="text"
        label="Where do you serve customers?"
        required
        helperText="Edmonton only? Alberta-wide? Online?"
        value={formData.serviceArea ?? ''}
        onChange={(v) => setField('serviceArea', v)}
      />
      <FormField
        type="textarea"
        label="What should someone do when they visit your website?"
        required
        helperText="Call you? Fill out a form? Book an appointment?"
        value={formData.websiteGoal ?? ''}
        onChange={(v) => setField('websiteGoal', v)}
      />
      {stepError && <p className="text-sm text-red-500 mt-2">{stepError}</p>}
    </div>,

    // Step 1 — Design & Content
    <div key="step1">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Design &amp; Content</h2>
      <FormField
        type="single-select"
        label="Do you have a logo?"
        required
        options={['Yes', 'No', 'I need one']}
        value={formData.hasLogo ?? ''}
        onChange={(v) => setField('hasLogo', v)}
      />
      <FormField
        type="single-select"
        label="Do you have brand colors?"
        required
        options={["Yes, I'll share them", 'No, pick something']}
        value={formData.hasBrandColors ?? ''}
        onChange={(v) => setField('hasBrandColors', v)}
      />
      <FormField
        type="file"
        label="Upload any files you'd like me to use"
        helperText="Logo, photos, team photos"
        fieldName="fileUpload"
        value={formData.fileUpload ?? ''}
        onChange={(v) => setField('fileUpload', v)}
        onFileUploaded={(name, url) =>
          setUploadedFiles((prev) => ({ ...prev, [name]: url }))
        }
      />
      <FormField
        type="textarea"
        label="Are there any websites you like the look of?"
        helperText="Doesn't have to be in your industry."
        value={formData.websitesYouLike ?? ''}
        onChange={(v) => setField('websitesYouLike', v)}
      />
      <FormField
        type="single-select"
        label="What tone or feel should your site have?"
        required
        options={['Professional & clean', 'Warm & friendly', 'Bold & modern', "I'm not sure"]}
        value={formData.siteTone ?? ''}
        onChange={(v) => setField('siteTone', v)}
      />
      <FormField
        type="multi-select"
        label="Which pages do you need?"
        required
        options={['Home', 'About', 'Services', 'Contact', 'Gallery', 'Testimonials', 'FAQ', 'Other']}
        value={formData.pagesNeeded ?? []}
        onChange={(v) => setField('pagesNeeded', v)}
      />
      <FormField
        type="multi-select"
        label="Any specific features you need?"
        options={[
          'Contact form',
          'Click-to-call',
          'Google Maps',
          'Photo gallery',
          'Booking link',
          'Social links',
          'Other',
        ]}
        value={formData.featuresNeeded ?? []}
        onChange={(v) => setField('featuresNeeded', v)}
      />
      {stepError && <p className="text-sm text-red-500 mt-2">{stepError}</p>}
    </div>,

    // Step 2 — Domain & Hosting
    <div key="step2">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Domain &amp; Hosting</h2>
      <FormField
        type="single-select"
        label="Do you already own a domain name?"
        required
        options={['Yes', 'No', "I'm not sure"]}
        value={formData.domainOwnership ?? ''}
        onChange={(v) => setField('domainOwnership', v)}
      />
      {formData.domainOwnership === 'Yes' && (
        <FormField
          type="text"
          label="If yes, what's the domain?"
          value={formData.domainName ?? ''}
          onChange={(v) => setField('domainName', v)}
        />
      )}
      <FormField
        type="single-select"
        label="Do you have hosting set up?"
        required
        options={['Yes', 'No', "I don't know what that means"]}
        value={formData.hasHosting ?? ''}
        onChange={(v) => setField('hasHosting', v)}
      />
      {stepError && <p className="text-sm text-red-500 mt-2">{stepError}</p>}
    </div>,

    // Step 3 — Agreement
    <div key="step3">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Agreement</h2>
      <FormField
        type="text"
        label="Is there a deadline or event driving this?"
        helperText="Grand opening, busy season, etc."
        value={formData.projectDeadline ?? ''}
        onChange={(v) => setField('projectDeadline', v)}
      />
      <FormField
        type="textarea"
        label="Anything else I should know?"
        value={formData.additionalInfo ?? ''}
        onChange={(v) => setField('additionalInfo', v)}
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
        onChange={(v) => setField('termsAgreed', v)}
      />
      {stepError && <p className="text-sm text-red-500 mt-2">{stepError}</p>}
    </div>,

    // Step 4 — Payment
    <div key="step4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Pay your deposit to lock in your spot
      </h2>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      <StripePaymentStep
        amount={75000}
        currency="usd"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>,
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Let&apos;s Build Your Website</h1>
          <p className="text-gray-500 mt-2">
            This takes about 10 minutes. Everything here helps me build the right site for your
            business — no back and forth needed.
          </p>
        </div>
        <MultiStepForm
          steps={steps}
          currentStep={currentStep}
          totalSteps={5}
          onNext={handleNext}
          onBack={handleBack}
          isLastStep={currentStep === 4}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
