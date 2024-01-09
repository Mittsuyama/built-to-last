import { memo } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Lucky } from '@/components/biz/Lucky/Lucky';
import { fetchStockDetail } from './fetchStockDetail';

interface StockDetailMenuProps {
  code: string;
  sType: string;
}

export const StockDetailMenu = memo<StockDetailMenuProps>(async ({ code, sType }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href={`https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=${sType}${code}#/cwfx`} target="_blank">
            其他数据
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`https://data.eastmoney.com/notices/stock/${code}.html`} target="_blank">
            公司公告
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Lucky>
            手气不错
          </Lucky>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="https://github.com/mittsuyama" target="_blank">
            GitHub
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

StockDetailMenu.displayName = 'StockDetailMenu';

