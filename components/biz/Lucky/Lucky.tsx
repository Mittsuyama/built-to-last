'use client';
import {
  memo,
  useState,
  type PropsWithChildren,
} from 'react';
import NProgress from 'nprogress';
import { useRouter } from 'next/navigation';
import { useMemoizedFn, useMount } from 'ahooks';
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
      minTotalMarketCAP: 20_000_000_000,
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

  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
});

Lucky.displayName = 'Lucky';

