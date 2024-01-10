import { atomWithStorage } from 'jotai/utils';
import { SearchStockItem } from '@/types';

export const favStockListAtom = atomWithStorage<SearchStockItem[]>(
  'fav-stock-list',
  [],
);
