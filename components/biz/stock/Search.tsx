'use client';
import { memo } from 'react';
import cls from 'classnames';
import { Button } from '@/components/ui/button';
import { QuickSearch } from '@/components/biz/QuickSearch';

interface SearchProps {
  className?: string;
}

export const Search = memo<SearchProps>(({ className }) => {
  return (
    <QuickSearch>
      <Button
        variant="outline"
        onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
      >
        <div className={cls('flex w-[200px] justify-between', className)}>
          搜索...
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 pt-[1px] font-mono text-sm font-medium text-muted-foreground opacity-100">
            <span className="text-lg">⌘</span>
            <span>
              K
            </span>
          </kbd>
        </div>
      </Button>
    </QuickSearch>
  );
});

Search.displayName = 'Search';

