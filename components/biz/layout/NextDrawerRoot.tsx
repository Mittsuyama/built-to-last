'use client';

import { PropsWithChildren, memo } from 'react';
import { Drawer } from 'vaul';

export const NextDrawerRoot = memo<PropsWithChildren<{}>>(async ({ children }) => {
  return (
    <Drawer.Root>
      {children}
    </Drawer.Root>
  );
});

NextDrawerRoot.displayName = 'NextDrawerRoot';

