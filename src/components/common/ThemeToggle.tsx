'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  className?: string;
  variant?: 'ghost' | 'outline' | 'subtle';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export function ThemeToggle({
  className,
  variant = 'ghost',
  size = 'icon',
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { isBangla } = useAppTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme || theme) : 'dark';
  const isDark = currentTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const labelText = isDark
    ? isBangla
      ? 'লাইট মোড চালু করুন'
      : 'Switch to Light Mode'
    : isBangla
      ? 'ডার্ক মোড চালু করুন'
      : 'Switch to Dark Mode';

  if (!mounted) {
    return (
      <Button
        variant={variant === 'subtle' ? 'ghost' : variant}
        size={size}
        className={cn(
          'text-muted-foreground hover:text-foreground relative transition-colors duration-200',
          className
        )}
        disabled
        aria-label="Theme toggle loading"
      >
        <span className="h-5 w-5 opacity-0 block" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant === 'subtle' ? 'ghost' : variant}
      size={size}
      onClick={toggleTheme}
      title={labelText}
      aria-label={labelText}
      className={cn(
        'text-muted-foreground hover:text-foreground relative transition-colors duration-200 cursor-pointer',
        showLabel && 'gap-2 px-3',
        className
      )}
    >
      <div className="relative h-5 w-5 flex items-center justify-center">
        <Sun
          className={cn(
            'h-5 w-5 transition-all duration-300 transform',
            isDark
              ? 'rotate-90 scale-0 opacity-0 absolute'
              : 'rotate-0 scale-100 opacity-100 text-amber-500'
          )}
        />
        <Moon
          className={cn(
            'h-5 w-5 transition-all duration-300 transform',
            isDark
              ? 'rotate-0 scale-100 opacity-100 text-indigo-400'
              : '-rotate-90 scale-0 opacity-0 absolute'
          )}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-medium">
          {isDark
            ? isBangla
              ? 'লাইট মোড'
              : 'Light'
            : isBangla
              ? 'ডার্ক মোড'
              : 'Dark'}
        </span>
      )}
    </Button>
  );
}

export default ThemeToggle;
