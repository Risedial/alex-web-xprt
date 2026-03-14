'use client';

import { useEffect, useState } from 'react';

interface StepTransitionProps {
  children: React.ReactNode;
  direction: 'forward' | 'back';
  step: number;
}

export default function StepTransition({ children, direction, step }: StepTransitionProps) {
  const startX = direction === 'forward' ? '100%' : '-100%';

  const [transform, setTransform] = useState(`translateX(${startX})`);
  const [transition, setTransition] = useState('none');

  useEffect(() => {
    const offscreen = direction === 'forward' ? '100%' : '-100%';
    // Snap to offscreen without transition
    setTransition('none');
    setTransform(`translateX(${offscreen})`);

    // After the browser has painted the offscreen position, animate to center
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransition('transform 250ms ease-in-out');
        setTransform('translateX(0)');
      });
    });

    return () => cancelAnimationFrame(rafId);
  }, [step, direction]);

  return (
    <div
      style={{
        transform,
        transition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
