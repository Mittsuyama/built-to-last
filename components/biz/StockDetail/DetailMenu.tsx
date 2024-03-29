'use client';

import { memo, useRef } from 'react';
import { Menu, Dices, Github, Sheet, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link-with-progress';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';
import { ToggleFavButton } from '@/components/biz/stock/ToggleFavButton';
import { Lucky } from '@/components/biz/Lucky/Lucky';

interface StockDetailMenuProps {
  code: string;
  sType: string;
}

export const StockDetailMenu = memo<StockDetailMenuProps>(({ code, sType }) => {
  const closerRef = useRef<HTMLButtonElement>(null);

  return (
    <Drawer onClose={() => document.body.style.background = ''}>
      <DrawerTrigger>
        <Menu className="mx-2 w-5 h-5" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerClose ref={closerRef} className="hidden" />
        <DrawerHeader>
          <DrawerTitle>更多...</DrawerTitle>
          <DrawerDescription>选择需要的操作</DrawerDescription>
        </DrawerHeader>
        <div
          className="p-4 mb-[env(safe-area-inset)]"
          onClick={() => closerRef.current?.click()}
        >
          <Link
            className="block"
            href={`https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=${sType}${code}#/cwfx`}
            target="_blank"
          >
            <Button className="flex w-full mb-2 gap-2" variant="outline" size="lg">
              <Sheet /> 其他数据
            </Button>
          </Link>
          <Link
            className="block"
            href={`https://data.eastmoney.com/notices/stock/${code}.html`}
            target="_blank"
          >
            <Button className="flex w-full mb-2 gap-2" variant="outline" size="lg">
              <MessageSquareText /> 公司公告
            </Button>
          </Link>
          <Link
            className="block"
            href="https://github.com/Mittsuyama/built-to-last"
            target="_blank"
          >
            <Button className="flex w-full mb-2 gap-2" variant="outline" size="lg">
              <Github /> GitHub
            </Button>
          </Link>
          <Lucky>
            <Button className="flex w-full mb-2 gap-2" variant="outline" size="lg">
              <Dices/> 手气不错
            </Button>
          </Lucky>
          <ToggleFavButton
            stockId={`${code}.${sType}`}
            className="flex w-full"
            variant="default"
            size="lg"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
});

StockDetailMenu.displayName = 'StockDetailMenu';

