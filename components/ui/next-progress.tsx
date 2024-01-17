'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';
import { usePathname, useSearchParams } from 'next/navigation';

NProgress.configure({
  showSpinner: false,
  trickle: true,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: 'ease',
  speed: 200,
});

const defaultColor = '#29d';

export const NextProgress = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(
    () => {
      NProgress.done();
    },
    [pathname, searchParams],
  );

  return null;
};

