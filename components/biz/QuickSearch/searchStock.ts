"use server";

export interface SearchStockItem {
  name: string;
  code: string;
  abbr: string;
  /** 交易所名称 */
  securityTypeName: string;
}

export const searchStock = async (value: string): Promise<SearchStockItem[]> => {
  const res = await fetch(
    `https://search-codetable.eastmoney.com/codetable/search/web?client=web&keyword=${value.trim()}&pageIndex=1&pageSize=10`,
    { method: 'GET' },
  );
  const json = await res.json();
  return ((json?.result || []) as any[]).map((item) => ({
    name: item.shortName,
    code: item.code,
    abbr: item.pinyin,
    securityTypeName: item.securityTypeName,
  }));
};
