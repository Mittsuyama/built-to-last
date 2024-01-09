'use server';

export interface BizItem {
  SECUCODE: string;
  SECURITY_CODE: string;
  // 2023-06-30 00:00:00
  REPORT_DATE: string;
  // 1 2 3
  MAINOP_TYPE: string;
  // 茅台酒
  ITEM_NAME: string;
  // 59278599200
  MAIN_BUSINESS_INCOME: number;
  // 0.851998
  MBI_RATIO: number;
  // 1 2 3...
  RANK: number;
}

export const fetchBusiness = async (stockId: string) => {
  const url = 'https://datacenter.eastmoney.com/securities/api/data/v1/get';
  const search = new URLSearchParams({
    reportName: 'RPT_F10_FN_MAINOP',
    columns: 'SECUCODE,SECURITY_CODE,REPORT_DATE,MAINOP_TYPE,ITEM_NAME,MAIN_BUSINESS_INCOME,MBI_RATIO,MAIN_BUSINESS_COST,MBC_RATIO,MAIN_BUSINESS_RPOFIT,MBR_RATIO,GROSS_RPOFIT_RATIO,RANK',
    filter: `(SECUCODE="${stockId}")`,
    pageNumber: '1',
    pageSize: '200',
    sortTypes: '-1,1,1',
    sortColumns: 'REPORT_DATE,MAINOP_TYPE,RANK',
    source: 'HSF10',
    client: 'PC',
  });

  const res = await (await fetch(`${url}?${search.toString()}`)).json();
  const list: BizItem[] = res.result.data;

  const lastAnualDate = list.reduce(
    (pre, cur) => {
      const [year, month, day] = cur.REPORT_DATE.split(' ')[0].split('-');
      if (month === '12' && Number(year) > pre.year) {
        return {
          year: Number(year),
          date: `${year}-${month}-${day}`,
        };
      }
      return pre;
    },
    {
      year: 0,
      date: '',
    },
  )

  const bizList = list.filter((item) => item.REPORT_DATE.startsWith(lastAnualDate.date));
  
  const bizListByProduct = bizList
    .filter((item) => item.MAINOP_TYPE === '2')
    .sort((a, b) => b.MAIN_BUSINESS_INCOME - a.MAIN_BUSINESS_INCOME);
  const bizListByDistrict = bizList
    .filter((item) => item.MAINOP_TYPE === '3')
    .sort((a, b) => b.MAIN_BUSINESS_INCOME - a.MAIN_BUSINESS_INCOME);

  return {
    bizListByProduct,
    bizListByDistrict,
  };
};

