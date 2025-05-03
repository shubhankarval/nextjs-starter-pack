'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (resolvedTheme === 'dark') {
    return (
      <Sun
        size={20}
        className="text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={() => setTheme('light')}
      />
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <Moon
        size={20}
        className="text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={() => setTheme('dark')}
      />
    );
  }
}
