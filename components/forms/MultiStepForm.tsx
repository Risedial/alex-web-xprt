'use client';

import { useEffect, useRef, useState } from 'react';
import ProgressBar from './ProgressBar';
import StepTransition from './StepTransition';

interface MultiStepFormProps {
  steps: React.ReactNode[];
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

export default function MultiStepForm({
  steps,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isLastStep = false,
  isSubmitting = false,
}: MultiStepFormProps) {
  const prevStepRef = useRef(currentStep);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  useEffect(() => {
    if (currentStep > prevStepRef.current) {
      setDirection('forward');
    } else if (currentStep < prevStepRef.current) {
      setDirection('back');
    }
    prevStepRef.current = currentStep;
  }, [currentStep]);

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar current={currentStep + 1} total={totalSteps} />
      <div style={{ overflow: 'hidden' }}>
        <StepTransition step={currentStep} direction={direction}>
          {steps[currentStep]}
        </StepTransition>
      </div>
      <div className="flex gap-3 mt-2">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={onBack}
            style={{ minHeight: '44px', fontSize: '16px' }}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          style={{ minHeight: '44px', fontSize: '16px' }}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting…' : isLastStep ? 'Submit' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
