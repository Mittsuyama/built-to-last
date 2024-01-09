'use server';

const getSearch = (stockId: string, reportName: string) => {
  return new URLSearchParams({
    reportName,
    columns: 'ALL',
    filter: `(SECUCODE="${stockId}")`,
    sortTypes: '1',
    sortColumns: 'PAIMING',
    source: 'HSF10',
    client: 'PC',
  });
};

const getAvgAndMedianValue = (name: string, arr: any[], keys: string[]) => {
  const cur = arr.find((item) => item['CORRE_SECURITY_NAME'] === name);
  const avg = arr.find((item) => item['CORRE_SECURITY_NAME'] === '行业平均');
  const med = arr.find((item) => item['CORRE_SECURITY_NAME'] === '行业中值');
  return keys.map((key) => [cur[key], avg[key], med[key]]);
};

const fetchPE = async (stockId: string, name: string) => {
  const url = 'https://datacenter.eastmoney.com/securities/api/data/v1/get';
  const search = getSearch(stockId, 'RPT_PCF10_INDUSTRY_CVALUE');
  const res = await (await fetch(`${url}?${search.toString()}`)).json();

  return getAvgAndMedianValue(name, res.result.data, ['PE_TTM']);
};

const fetchROE = async (stockId: string, name: string) => {
  const url = 'https://datacenter.eastmoney.com/securities/api/data/v1/get';
  const search = getSearch(stockId, 'RPT_PCF10_INDUSTRY_DBFX');
  const res = await (await fetch(`${url}?${search.toString()}`)).json();
  return getAvgAndMedianValue(name, res.result.data, ['ROE_AVG', 'XSJLL_AVG']);
};

const fetchTotalMarketCap = async (stockId: string) => {
  const getMarketCapData = async (type: string) => {
    const url = 'https://datacenter.eastmoney.com/securities/api/data/v1/get';
    const search = new URLSearchParams({
      reportName: 'RPT_PCF10_INDUSTRY_MARKET',
      columns: 'SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,ORG_CODE,CORRE_SECUCODE,CORRE_SECURITY_CODE,CORRE_SECURITY_NAME,CORRE_ORG_CODE,TOTAL_CAP,FREECAP,TOTAL_OPERATEINCOME,NETPROFIT,REPORT_TYPE,TOTAL_CAP_RANK,FREECAP_RANK,TOTAL_OPERATEINCOME_RANK,NETPROFIT_RANK',
      filter: `(SECUCODE="${stockId}")(CORRE_SECUCODE="${type}")`,
      pageNumber: '1',
      pageSize: '5',
      sortTypes: '-1',
      sortColumns: 'TOTAL_CAP',
      source: 'HSF10',
      client: 'PC',
    });
    const res = await (await fetch(`${url}?${search}`)).json();
    return res.result.data[0]['TOTAL_CAP'];
  };
  const [
    cur,
    avg,
    med,
  ] = await Promise.all([
    getMarketCapData(stockId),
    getMarketCapData('行业平均'),
    getMarketCapData('行业中值'),
  ]);
  return [cur, avg, med];
};

export const fetchIndustryInfo = async (stockId: string, name: string) => {
  const [
    [pe],
    [roe, netProfitRate],
    totalMarketCap,
  ] = await Promise.all([
    fetchPE(stockId, name),
    fetchROE(stockId, name),
    fetchTotalMarketCap(stockId),
  ]);

  return pe.map((_, index) => ({
    pe: pe[index],
    roe: roe[index],
    netProfitRate: netProfitRate[index],
    totalMarketCap: totalMarketCap[index],
  }));
};

