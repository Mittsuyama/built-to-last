'use client';

import {
  type PropsWithChildren,
  type FC,
  memo,
  useEffect,
  useState,
} from 'react';
import NProgress from 'nprogress';
import { useMemoizedFn, useDebounceFn } from 'ahooks';
import { useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchStockItem } from '@/types';
import { favStockListAtom } from '@/models/stock';
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Spin } from '@/components/ui/Spin';
import { searchStock } from './searchStock';

interface CommandItem {
  Icon: FC<{ className?: string }>;
  label: string;
  key: string;
}

const latestSearchAtom = atomWithStorage<SearchStockItem[]>(
  'latest-search',
  [],
);

export const QuickSearch = memo<PropsWithChildren<{}>>((props) => {
  const { children } = props;
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const favStockList = useAtomValue(favStockListAtom);
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

  const searchStockItemRender = useMemoizedFn((list: SearchStockItem[], suffix: string) => {
    return list.map(({ name, stockId, sType, code }) => (
      <CommandItem
        value={`${stockId}.${name}.${suffix}`}
        key={`${stockId}.${name}.${suffix}`}
        onSelect={() => {
          NProgress.start();
          router.push(`/stock/${sType.toUpperCase()}/${code}`);
        }}
      >
        <Building2 className="mr-2 h-4 w-4" />
        <span className="mr-2">{name}</span>
        <Badge className="font-normal" variant="outline">{sType}</Badge>
      </CommandItem>
    ));
  });

  return (
    <>
      {children}
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <Command shouldFilter={false}>
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
                          {searchStockItemRender(res, 'res')}
                        </CommandGroup>
                      )}
                      {!!latest.length && !value && (
                        <CommandGroup heading="最近搜索">
                          {searchStockItemRender(latest, 'latest')}
                        </CommandGroup>
                      )}
                      {!value && !!favStockList.length && (
                        <CommandGroup heading="收藏内容">
                          {searchStockItemRender(favStockList, 'fav')}
                        </CommandGroup>
                      )}
                      <CommandSeparator />
                    </CommandList>
                  )
          }
        </Command>
      </CommandDialog>
    </>
  );
});

QuickSearch.displayName = 'QuickSearch';

