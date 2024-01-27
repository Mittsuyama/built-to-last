"use server";

import { SearchStockItem } from '@/types';

export const searchStock = async (value: string): Promise<SearchStockItem[]> => {
  const res = await fetch(
    `https://search-codetable.eastmoney.com/codetable/search/web?client=web&keyword=${value.trim()}&pageIndex=1&pageSize=10`,
    { method: 'GET' },
  );
  const json = await res.json();

  return ((json?.result || []) as any[]).map((item) => {
    const { securityTypeName } = item;
    let sType = 'UNKNOWN';
    if (securityTypeName === '深A') {
      sType = 'SZ';
    } else if (securityTypeName === '沪A') {
      sType = 'SH';
    } else if (securityTypeName === '京A') {
      sType = 'BJ';
    } else if (securityTypeName === '科创板') {
      sType = 'SH';
    } else if (securityTypeName === '港股') {
      sType = 'HK';
    }
    return {
      stockId: `${item.code}.${sType}`,
      name: item.shortName,
      code: item.code,
      sType,
    };
  });
};
