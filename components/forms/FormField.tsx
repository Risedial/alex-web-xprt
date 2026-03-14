'use client';

import { useRef, useState } from 'react';
import { uploadFile } from '@/lib/uploadFile';

interface FormFieldProps {
  type: 'text' | 'textarea' | 'single-select' | 'multi-select' | 'file' | 'checkbox' | 'text-block';
  label: string;
  required?: boolean;
  helperText?: string;
  options?: string[];
  value: any;
  onChange: (value: any) => void;
  uploadedFiles?: Record<string, string>;
  onFileUploaded?: (fieldName: string, url: string) => void;
  fieldName?: string;
}

export default function FormField({
  type,
  label,
  required,
  helperText,
  options,
  value,
  onChange,
  onFileUploaded,
  fieldName,
}: FormFieldProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const labelEl = (
    <div className="mb-2">
      <span className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {helperText && (
        <span className="block text-sm text-gray-400 mt-0.5">{helperText}</span>
      )}
    </div>
  );

  if (type === 'text-block') {
    return (
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
        <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 rounded-lg p-4 text-sm leading-relaxed">
          {value}
        </div>
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer" style={{ minHeight: '44px' }}>
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 flex-shrink-0"
          />
          <span style={{ fontSize: '16px' }} className="text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
        {helperText && (
          <p className="text-sm text-gray-400 mt-1 ml-8">{helperText}</p>
        )}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="mb-4">
        {labelEl}
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          style={{ fontSize: '16px' }}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="mb-4">
        {labelEl}
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={4}
          style={{ fontSize: '16px' }}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        />
      </div>
    );
  }

  if (type === 'single-select') {
    return (
      <div className="mb-4">
        {labelEl}
        <div className="flex flex-col gap-2">
          {(options ?? []).map((option) => {
            const isSelected = value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                style={{ minHeight: '44px', fontSize: '16px', textAlign: 'left' }}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'multi-select') {
    const selected: string[] = Array.isArray(value) ? value : [];
    const toggle = (option: string) => {
      if (selected.includes(option)) {
        onChange(selected.filter((v) => v !== option));
      } else {
        onChange([...selected, option]);
      }
    };

    return (
      <div className="mb-4">
        {labelEl}
        <div className="flex flex-col gap-2">
          {(options ?? []).map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggle(option)}
                style={{ minHeight: '44px', fontSize: '16px', textAlign: 'left' }}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{option}</span>
                {isSelected && (
                  <span className="ml-2 text-blue-600 flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M3 9l4.5 4.5L15 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'file') {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadStatus('uploading');
      setUploadError('');

      try {
        const url = await uploadFile(file);
        setUploadedFileName(file.name);
        setUploadStatus('done');
        onChange(url);
        if (onFileUploaded && fieldName) {
          onFileUploaded(fieldName, url);
        }
      } catch (err) {
        setUploadStatus('error');
        setUploadError((err as Error).message ?? 'Upload failed');
      }
    };

    return (
      <div className="mb-4">
        {labelEl}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{ minHeight: '44px', fontSize: '16px' }}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors text-left"
        >
          {uploadStatus === 'idle' && 'Choose file…'}
          {uploadStatus === 'uploading' && 'Uploading…'}
          {uploadStatus === 'done' && `✓ ${uploadedFileName}`}
          {uploadStatus === 'error' && 'Choose file…'}
        </button>
        {uploadStatus === 'error' && (
          <p className="text-sm text-red-500 mt-1">{uploadError}</p>
        )}
      </div>
    );
  }

  return null;
}
