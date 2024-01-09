'use client';
import { Button } from '@/components/ui/button';

export const SearchButton = () => {
  return (
    <Button
      onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
      className="flex gap-2"
    >
      <span>搜索</span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-sm font-medium text-muted-foreground opacity-100">
        <span className="text-lg">⌘</span>
        <span>
          K
        </span>
      </kbd>
    </Button>
  );
};

