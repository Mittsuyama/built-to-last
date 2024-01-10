'use client';

import { memo, useState } from 'react';
import { useAsyncEffect } from 'ahooks';
import { Star, StarOff } from 'lucide-react';
import { useAtom } from 'jotai';
import { SearchStockItem } from '@/types';
import { Spin } from '@/components/ui/Spin';
import { Button, type ButtonProps } from '@/components/ui/button';
import { favStockListAtom } from '@/models/stock';
import { fetchStockDetail } from '@/components/biz/StockDetail/fetchStockDetail';

export const ToggleFavButton = memo<ButtonProps & { stockId: string }>((props) => {
  const { stockId, ...rest } = props;
  const [profile, setProfile] = useState<SearchStockItem | null>(null);
  const [list, setList] = useAtom(favStockListAtom);
  const [isFaved, setIsFaved] = useState(false);

  useAsyncEffect(
    async () => {
      const [code, sType] = stockId.split('.');
      const res = await fetchStockDetail(stockId);
      setProfile({
        stockId: res.id,
        code,
        sType,
        name: res.name,
      });
      // effect 处理是为了避免 SSR 和 CSR 渲染不一致导致的报错
      setIsFaved(list.some((item) => item.stockId === stockId));
    },
    [stockId, list],
  );

  const onClick = () => {
    if (!profile) {
      return;
    }
    const faved = list.some((item) => item.stockId === stockId);
    if (faved) {
      setList(list.filter((item) => item.stockId !== stockId));
    } else {
      setList([...list, profile]);
    }
  };

  return (
    <Button disabled={!profile} onClick={onClick} {...rest}>
      {
        !profile
          ? <Spin className="mr-2 w-4 h-4" />
          : isFaved
            ? <StarOff className="mr-2 w-4 h-4" />
            : <Star className="mr-2 w-4 h-4" />
      }
      {
        isFaved ? '取消收藏' : '收藏公司'
      }
    </Button>
  );
});

ToggleFavButton.displayName = 'ToggleFavButton';

