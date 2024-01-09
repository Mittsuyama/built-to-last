'use server';
import { StockDetail } from '@/types';

const url = 'https://datacenter.eastmoney.com/securities/api/data/get';

/** 获取板块信息 */
export const fetchBoardList = async (stockId: string): Promise<Array<{ name: string; type: string; }>> => {
  const search = new URLSearchParams({
    type: 'RPT_F10_CORETHEME_BOARDTYPE',
    sty: 'SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,BOARD_CODE,BOARD_NAME,IS_PRECISE,BOARD_RANK,BOARD_TYPE',
    filter: `(SECUCODE="${stockId}")`,
    p: '1',
    sr: '1',
    st: 'BOARD_RANK',
    source: 'HSF10',
    client: 'PC',
  });
  const response = await fetch(`${url}?${search.toString()}`, { cache: 'force-cache' });
  const res = await response.json();

  return res.result.data.map((item: any) => ({
    name: item.BOARD_NAME,
    type: item.BOARD_TYPE,
  }));
};

