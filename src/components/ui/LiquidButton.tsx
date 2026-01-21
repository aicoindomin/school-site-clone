import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  variant?: 'nav' | 'action';
}

export const LiquidButton = ({ 
  children,
  onClick,
  className,
  isActive = false,
  variant = 'nav'
}: LiquidButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate distance from center
    const offsetX = x - rect.width / 2;
    const offsetY = y - rect.height / 2;

    // Physics constants - softer, playful feel for kids school
    const shadowX = offsetX / 6;
    const shadowY = offsetY / 2;
    const insetX = offsetX / 25;
    const insetY = offsetY / 10;

    // India-friendly school colors - Royal Blue tones
    const darkShadow = 'hsla(220, 60%, 55%, 0.5)';
    const lightShadow = 'hsla(0, 0%, 100%, 0.9)';

    // Apply the dynamic shadow
    button.style.boxShadow = `
      inset ${-insetX}px ${-insetY}px 6px ${darkShadow},
      inset ${insetX}px ${insetY}px 6px ${lightShadow},
      ${shadowX}px ${shadowY}px 12px -4px ${lightShadow},
      ${shadowX * 1.5}px ${shadowY * 1.5}px 18px ${darkShadow}
    `;
  };

  const handleMouseLeave = () => {
    const button = buttonRef.current;
    if (!button) return;
    
    const darkShadow = 'hsla(220, 60%, 55%, 0.4)';
    const lightShadow = 'hsla(0, 0%, 100%, 0.8)';

    // Reset to default "resting" state
    button.style.boxShadow = `
      inset 0 -3px 4px ${darkShadow},
      inset 0 3px 4px ${lightShadow},
      0 6px 12px -4px ${lightShadow},
      0 8px 16px ${darkShadow}
    `;
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center gap-2 px-5 py-2.5 rounded-2xl",
        "font-semibold text-sm tracking-wide",
        "transition-[box-shadow,transform] duration-200 ease-out",
        "active:scale-[0.97] cursor-pointer select-none",
        "border-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        isActive && "ring-2 ring-primary/30",
        className
      )}
      style={{
        background: isActive 
          ? 'linear-gradient(145deg, hsl(220, 80%, 96%) 0%, hsl(220, 70%, 90%) 100%)'
          : 'linear-gradient(145deg, hsl(220, 60%, 98%) 0%, hsl(220, 50%, 94%) 100%)',
        boxShadow: `
          inset 0 -3px 4px hsla(220, 60%, 55%, 0.4),
          inset 0 3px 4px hsla(0, 0%, 100%, 0.8),
          0 6px 12px -4px hsla(0, 0%, 100%, 0.8),
          0 8px 16px hsla(220, 60%, 55%, 0.4)
        `,
        color: isActive ? 'hsl(220, 70%, 45%)' : 'hsl(220, 50%, 35%)',
      }}
    >
      {children}
    </button>
  );
};

export default LiquidButton;
