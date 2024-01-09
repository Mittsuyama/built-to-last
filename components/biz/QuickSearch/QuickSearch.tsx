'use client';

import {
  type PropsWithChildren,
  type FC,
  memo,
  useEffect,
  useState,
} from 'react';
import { useMemoizedFn, useDebounceFn } from 'ahooks';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Building2, CandlestickChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge"
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Spin } from '@/components/ui/Spin';
import { searchStock, SearchStockItem } from './searchStock';

interface CommandItem {
  Icon: FC<{ className?: string }>;
  label: string;
  key: string;
}

const suggestList: CommandItem[] = [
  { Icon: CandlestickChart, label: '沪深 300', key: '000001' },
  { Icon: CandlestickChart, label: '上证 300', key: '000300' },
];

const latestSearchAtom = atomWithStorage<SearchStockItem[]>(
  'latest-search',
  [],
);

export const QuickSearch = memo<PropsWithChildren<{}>>((props) => {
  const { children } = props;
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [latest, setLatest] = useAtom(latestSearchAtom);
  const [searching, setSearching] = useState(false);
  const [res, setRes] = useState<SearchStockItem[]>([]);
  const router = useRouter();

  const keyDownHandler = useMemoizedFn((e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOpen((open) => !open)
    }
  })

  useEffect(
    () => {
      document.addEventListener('keydown', keyDownHandler);
      return () => {
        document.removeEventListener('keydown', keyDownHandler);
      };
    },
    [keyDownHandler],
  );

  const { run: onSearch } = useDebounceFn(useMemoizedFn(async (inputValue: string) => {
    try {
      const res = await searchStock(inputValue);
      setRes(res);
    } catch {
      setRes([]);
    }finally {
      setSearching(false);
    }
  }), { wait: 500 });

  const onValueChange =  useMemoizedFn(async (inputValue: string) => {
    setValue(inputValue);
    if (!inputValue) {
      setRes([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    await onSearch(inputValue);
  });

  const onOpenChange = useMemoizedFn((isOpen: boolean) => {
    setValue('');
    setRes([]);
    setOpen(isOpen);
  });

  const searchStockItemRender = useMemoizedFn((list: SearchStockItem[]) => {
    return list.map(({ name, code, abbr, securityTypeName }) => (
      <CommandItem
        value={`${name}-${code}-${abbr}-${securityTypeName}`}
        key={`${name}-${code}-${abbr}-${securityTypeName}`}
        onSelect={(value) => {
          const [, code] = value.split('-');
          let sType = 'UNKNOWN';
          const stock = list.find((item) => item.code == code);
          if (securityTypeName === '深A') {
            sType = 'SZ';
          } else if (securityTypeName === '沪A') {
            sType = 'SH';
          } else if (securityTypeName === '京A') {
            sType = 'BJ';
          }
          if (stock) {
            setLatest([stock, ...latest.filter(item => item.code !== stock.code).slice(0, 4)]);
            router.push(`/stock/${sType.toUpperCase()}/${stock.code}`);
          }
        }}
      >
        <Building2 className="mr-2 h-4 w-4" />
        <span className="mr-2">{name}</span>
        <Badge className="font-normal" variant="outline">{securityTypeName}</Badge>
      </CommandItem>
    ));
  });

  return (
    <>
      {children}
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput
          placeholder="输入名字、代码、或拼音首字母进行搜索..."
          value={value}
          onValueChange={onValueChange}
        />
        {
          searching
            ? (
              <CommandList key="searching">
                <Spin className="block my-4" />
              </CommandList>
            )
            : value && !res.length
              ? (
                <CommandList key="no-result">
                  <div className="my-4 flex justify-center items-center text-sm">
                    无搜索内容
                  </div>
                </CommandList>
               )
               : (
                  <CommandList key="has-result">
                    {!!res.length && (
                      <CommandGroup heading="搜索结果">
                        {searchStockItemRender(res)}
                      </CommandGroup>
                    )}
                    {!!latest.length && !value && (
                      <CommandGroup heading="最近搜索">
                        {searchStockItemRender(latest)}
                      </CommandGroup>
                    )}
                    {!value && (
                      <CommandGroup heading="推荐内容">
                        {
                          suggestList.map(({ label, Icon, key }) => (
                            <CommandItem key={key}>
                              <Icon className="mr-2 h-4 w-4" />
                              <span>{label}</span>
                            </CommandItem>
                          ))
                        }
                      </CommandGroup>
                    )}
                    <CommandSeparator />
                  </CommandList>
                )
        }
      </CommandDialog>
    </>
  );
});

QuickSearch.displayName = 'QuickSearch';

