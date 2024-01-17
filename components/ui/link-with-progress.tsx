'use client';

import { memo, ComponentProps, forwardRef } from 'react';
import NProgress from 'nprogress';
import NextLink from 'next/link';
import { addBasePath } from "next/dist/client/add-base-path";

function getURL(href: string): URL {
  return new URL(addBasePath(href), location.href);
}

// https://github.com/vercel/next.js/blob/400ccf7b1c802c94127d8d8e0d5e9bdf9aab270c/packages/next/src/client/link.tsx#L169
function isModifiedEvent(event: React.MouseEvent): boolean {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement;
  const target = eventTarget.getAttribute("target");
  return (
    (target && target !== "_self") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    (event.nativeEvent && event.nativeEvent.button === 1)
  );
}

export function shouldTriggerStartEvent(href: string, clickEvent?: React.MouseEvent) {
  const current = window.location;
  const target = getURL(href);

  if (clickEvent && isModifiedEvent(clickEvent)) return false; // modified events: fallback to browser behaviour
  if (current.origin !== target.origin) return false; // external URL
  if (current.pathname === target.pathname && current.search === target.search) return false; // same URL

  return true;
}

export const Link = forwardRef<HTMLAnchorElement, ComponentProps<'a'>>((props, ref) => {
  const { onClick, href, children, ...rest } = props;

  if (!href || !href.startsWith('/')) {
    return <a href={href} onClick={onClick} {...rest}>{children}</a>;
  }

  return (
    <NextLink
      {...rest}
      ref={ref}
      href={href}
      onClick={(e) => {
        if (shouldTriggerStartEvent(href, e)) {
          NProgress.start();
        }
        onClick?.(e);
      }}
    >
      {children}
    </NextLink>
  );
});

Link.displayName = 'LinkWithProgress';

