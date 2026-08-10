// Hello Khata OS - HRM Avatar
// হ্যালো খাতা - এইচআরএম অ্যাভাটার

'use client';

import { cn } from '@/lib/utils';

const GRADIENTS = [
  'from-indigo to-violet',
  'from-emerald to-teal',
  'from-amber to-orange',
  'from-rose to-pink',
  'from-sky to-blue',
  'from-fuchsia to-purple',
];

function gradientFor(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return GRADIENTS[sum % GRADIENTS.length];
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

interface Props {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-lg',
};

export function HrmAvatar({ name, className, size = 'md' }: Props) {
  return (
    <div
      className={cn(
        'relative rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-white shrink-0 select-none',
        gradientFor(name),
        SIZES[size],
        className
      )}
    >
      {initials(name)}
    </div>
  );
}
