'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const SearchButton = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="flex gap-2"
          >
            <Search className="w-4 h-4" />
            开始搜索
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center">
            <div>
              快捷键：
            </div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 pt-[1px] font-mono text-sm font-medium text-muted-foreground opacity-100">
              <span className="text-lg">⌘</span>
              <span>
                K
              </span>
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

