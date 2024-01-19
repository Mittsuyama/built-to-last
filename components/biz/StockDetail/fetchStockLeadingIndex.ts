"use server";

interface LeadingIndicators {
  /** 出报时间（中文） */
  REPORT_DATE_NAME: string;
}

const url = 'https://datacenter.eastmoney.com/securities/api/data/get';

export const fetchLeadingIndex = async (stock: { sType: string; code: string }) => {
  let filter = `(SECUCODE="${stock.code}.${stock.sType.toUpperCase()}")`;
  filter += '(REPORT_TYPE="年报")';

  const search = new URLSearchParams({
    type: 'RPT_F10_FINANCE_MAINFINADATA',
    sty: 'APP_F10_MAINFINADATA',
    quoteColumns: '',
    filter,
    p: '1',
    ps: '11',
    sr: '-1',
    st: 'REPORT_DATE',
    source: 'HSF10',
    client: 'PC',
  });
  const response = await fetch(`${url}?${search.toString()}`, { cache: 'force-cache' });
  const res = await response.json();

  if (!res?.result?.data) {
    throw new Error('fetch leading indicators failed');
  }

  return (res.result.data as any[]).map<LeadingIndicators>((item: any) => ({
    ...item,
    reportYear: Number(item.REPORT_YEAR),
  }));
};
