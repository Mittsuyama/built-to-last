'use client';

import {
  memo,
  useState,
  type PropsWithChildren,
  useEffect,
} from 'react';
import NProgress from 'nprogress';
import { useRouter } from 'next/navigation';
import { useMemoizedFn, useMount } from 'ahooks';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { StockBaseInfo } from '@/types';
import { fetchStockBaseInfoListByFilter } from './fetchBaseInfoList';

export const Lucky = memo<PropsWithChildren<{ className?: string }>>((props) => {
  const { children, className } = props;

  const router = useRouter();

  const [list, setList] = useState<Array<StockBaseInfo> | null>(null);

  useMount(async () => {
    const res = await fetchStockBaseInfoListByFilter({
      maxPe: 25,
      minPe: 0,
      minTotalMarketCAP: 10_000_000_000,
      minROE: 10,
    });
    setList(res);
  });

  const onClick = useMemoizedFn(() => {
    if (!list) {
      return;
    }
    const pick = list[Math.floor(Math.random() * list.length)]
    const [code, sType] = pick.id.split('.');
    NProgress.start();
    router.push(`/stock/${sType.toUpperCase()}/${code}`);
  });

  const keyDownHandler = useMemoizedFn((e: KeyboardEvent) => {
    if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onClick();
    }
  })

  useEffect(
    () => {
      // keypress 针对 safari 场景
      document.addEventListener('keypress', keyDownHandler);
      document.addEventListener('keydown', keyDownHandler);
      return () => {
        document.removeEventListener('keypress', keyDownHandler);
        document.removeEventListener('keydown', keyDownHandler);
      };
    },
    [keyDownHandler],
  );

  return (
    <div onClick={onClick} className={className}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {children}
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center">
              <div>
                快捷键：
              </div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 pt-[1px] font-mono text-sm font-medium text-muted-foreground opacity-100">
                <span className="text-lg">⌘</span>
                <span>
                  I
                </span>
              </kbd>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

Lucky.displayName = 'Lucky';

