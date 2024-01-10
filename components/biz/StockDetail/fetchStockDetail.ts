'use server';
import { StockDetail } from '@/types';

const url = 'https://datacenter.eastmoney.com/securities/api/data/v1/get';

export const fetchStockDetail = async (stockId: string): Promise<StockDetail> => {
  const [code, sType] = stockId.split('.');

  const search = new URLSearchParams({
    reportName: 'RPT_PCF10_FINANCEMAINFINADATA',
    columns: 'SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,REPORT_DATE,REPORT_TYPE,EPSJB,EPSKCJB,EPSXS,BPS,MGZBGJ,MGWFPLR,MGJYXJJE,TOTAL_OPERATEINCOME,TOTAL_OPERATEINCOME_LAST,PARENT_NETPROFIT,PARENT_NETPROFIT_LAST,KCFJCXSYJLR,KCFJCXSYJLR_LAST,ROEJQ,ROEJQ_LAST,XSMLL,XSMLL_LAST,ZCFZL,ZCFZL_LAST,YYZSRGDHBZC_LAST,YYZSRGDHBZC,NETPROFITRPHBZC,NETPROFITRPHBZC_LAST,KFJLRGDHBZC,KFJLRGDHBZC_LAST,TOTALOPERATEREVETZ,TOTALOPERATEREVETZ_LAST,PARENTNETPROFITTZ,PARENTNETPROFITTZ_LAST,KCFJCXSYJLRTZ,KCFJCXSYJLRTZ_LAST,TOTAL_SHARE,FREE_SHARE,EPSJB_PL,BPS_PL,FORMERNAME',
    filter: `(SECUCODE="${stockId}")`,
    sortTypes: '-1',
    sortColumns: 'REPORT_DATE',
    pageNumber: '1',
    pageSize: '1',
    source: 'HSF10',
    client: 'PC',
  });
  const response = await fetch(`${url}?${search.toString()}`, { cache: 'force-cache' });
  const res = await response.json();
  const stock = res.result.data[0];

  return {
    id: stock.SECUCODE,
    code,
    sType,
    name: stock['SECURITY_NAME_ABBR'],
    roe: stock['ROE_WEIGHT'],
    totalMarketCap: stock['TOTAL_MARKET_CAP'],
    ttmPe: stock['PE9'],
    grossProfitMargin: stock['XSMLL'],
    ...stock,
  };
};

