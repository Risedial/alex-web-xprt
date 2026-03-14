'use client';

import { useEffect, useState } from 'react';
import FormField from '@/components/forms/FormField';
import MultiStepForm from '@/components/forms/MultiStepForm';

export default function OneOffFixForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: string) => (value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateStep = (step: number): boolean => {
    if (step === 0) {
      return !!(formData.websiteUrl?.trim() && formData.currentPlatform);
    }
    if (step === 1) {
      return !!(
        formData.issueDescription?.trim() &&
        formData.hasAdminAccess &&
        formData.urgency
      );
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'One-Off Fix',
          fields: formData,
          uploadedFiles,
        }),
      });
      setIsComplete(true);
    } catch (err) {
      setError(
        'Submission failed. Please email alex@alexanderbitarservices.com directly with your issue details.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 2) {
      handleSubmit();
    } else {
      if (validateStep(currentStep)) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === 'Enter' && tag !== 'TEXTAREA' && tag !== 'BUTTON') {
        e.preventDefault();
        handleNext();
      }
      if (e.key === 'Escape') {
        if (currentStep > 0) handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, formData, uploadedFiles]);

  if (isComplete) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-700">
          Got it — I&apos;ll be in touch within a few hours. If you have any questions in the
          meantime, just email me at{' '}
          <a
            href="mailto:alex@alexanderbitarservices.com"
            className="text-blue-600 hover:underline"
          >
            alex@alexanderbitarservices.com
          </a>
        </p>
      </div>
    );
  }

  const steps = [
    // Step 0 — Your Site
    <div key="step-0">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Site</h2>
      <FormField
        type="text"
        label="Your website URL"
        required
        value={formData.websiteUrl ?? ''}
        onChange={set('websiteUrl')}
      />
      <FormField
        type="single-select"
        label="What platform is your site on?"
        required
        options={['WordPress', 'Wix', 'Squarespace', 'Other']}
        value={formData.currentPlatform ?? ''}
        onChange={set('currentPlatform')}
      />
    </div>,

    // Step 1 — Your Issue
    <div key="step-1">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Issue</h2>
      <FormField
        type="textarea"
        label="What's the issue or change you need?"
        required
        helperText="Broken page, slow loading, content update, mobile issue, etc."
        value={formData.issueDescription ?? ''}
        onChange={set('issueDescription')}
      />
      <FormField
        type="file"
        label="Upload screenshots of the problem"
        required={false}
        helperText="Screenshots help me understand exactly what you're seeing."
        value={formData.screenshotUpload ?? ''}
        onChange={set('screenshotUpload')}
        fieldName="screenshotUpload"
        onFileUploaded={(fieldName, url) =>
          setUploadedFiles((prev) => ({ ...prev, [fieldName]: url }))
        }
      />
      <FormField
        type="single-select"
        label="Do you have admin login access?"
        required
        options={['Yes', 'No', 'Not sure']}
        value={formData.hasAdminAccess ?? ''}
        onChange={set('hasAdminAccess')}
      />
      <FormField
        type="single-select"
        label="Is this urgent?"
        required
        options={['Yes, ASAP', 'Within a week is fine', 'No rush']}
        value={formData.urgency ?? ''}
        onChange={set('urgency')}
      />
      <FormField
        type="textarea"
        label="Anything else?"
        required={false}
        value={formData.additionalInfo ?? ''}
        onChange={set('additionalInfo')}
      />
    </div>,

    // Step 2 — Confirmation
    <div key="step-2">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirmation</h2>
      <FormField
        type="text-block"
        label="What Happens Next"
        value="I'll send a clear quote before I start. If the fix doesn't solve the problem, you don't pay. Common fixes: $150–$500."
        onChange={() => {}}
      />
    </div>,
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell Me What Needs Fixing</h1>
        <p className="text-gray-500">
          Be as specific as you can — I&apos;ll send you a quote before any work starts.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        totalSteps={3}
        onNext={handleNext}
        onBack={handleBack}
        isLastStep={currentStep === 2}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
