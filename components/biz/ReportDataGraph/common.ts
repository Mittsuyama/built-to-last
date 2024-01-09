import { FinancialReportData } from '@/types/financial-report';
import {
  ACCOUNT_ITEM,
  CURRENT_ASSET,
  NON_CURRENT_ASSET,
  CURRENT_DEBT,
  NON_CURRENT_DEBT,
} from '@/constants/account-item';

export type SheetType
= 'asset'
| 'debt'
| 'current-asset'
| 'current-debt'
| 'non-currnet-asset'
| 'non-current-debt';

export const sheetType2Title: Record<SheetType, string> = {
  'asset': '资产',
  'debt': '负债',
  'current-asset': '流动资产',
  'non-currnet-asset': '非流动资产',
  'current-debt': '流动负债',
  'non-current-debt': '非流动负债',
};

export const totalKeyRecord: Record<SheetType, keyof typeof ACCOUNT_ITEM> = {
  'asset': 'z-zczj-资产总计',
  'debt': 'z-fzhj-负债合计',
  'current-asset': 'z-ldzchj-流动资产合计',
  'non-currnet-asset': 'z-fldzchj-非流动资产合计',
  'current-debt': 'z-ldfzhj-流动负债合计',
  'non-current-debt': 'z-fldfzhj-非流动负债合计',
};

type K = keyof typeof ACCOUNT_ITEM;

const currentAssetItemKeys = Object.keys(CURRENT_ASSET) as K[];
const nonCurrentAssetItemKeys: K[] = Object.keys(NON_CURRENT_ASSET) as K[];
const currentDebtItemKeys = Object.keys(CURRENT_DEBT) as K[];
const nonCurrentDebtItemKeys = Object.keys(NON_CURRENT_DEBT) as K[];
const assetItemKeys = [...currentAssetItemKeys, ...nonCurrentAssetItemKeys];
const debtItemKeys = [...currentDebtItemKeys, ...nonCurrentDebtItemKeys];

const sheetType2Keys: Record<SheetType, Array<keyof typeof ACCOUNT_ITEM>> = {
  'asset': assetItemKeys,
  'debt': debtItemKeys,
  'current-asset': currentAssetItemKeys,
  'non-currnet-asset': nonCurrentAssetItemKeys,
  'current-debt': currentDebtItemKeys,
  'non-current-debt': nonCurrentDebtItemKeys,
};

export interface CommonGraphProps {
  type: SheetType;
  reports: FinancialReportData[];
}

interface ChartDataItem {
  year: string
  type: string;
  percent: number;
  value: number;
}

const getValidItems = (report: FinancialReportData, type: SheetType) => {
  const total: number = Number(report[ACCOUNT_ITEM[totalKeyRecord[type]]]) || 0;

  const datas = sheetType2Keys[type]
    .map<ChartDataItem | undefined>((key) => {
      const value = (Number(report[ACCOUNT_ITEM[key]]) || 0);
      const percent = (Number(report[ACCOUNT_ITEM[key]]) || 0) / total * 100;
      if (percent > 5) {
        const [, , chinese] = key.split('-');
        return {
          year: String(report['REPORT_YEAR']),
          type: chinese,
          value,
          percent,
        };
      }
      return undefined;
    })
    .filter(Boolean);

  const totalValue = datas.reduce((pre, cur) => pre + (cur?.value || 0), 0);
  const totalPercent = datas.reduce((pre, cur) => pre + (cur?.percent || 0), 0);

  return datas
    .concat({
      year: String(report['REPORT_YEAR']),
      type: '剩余',
      value: total - totalValue,
      percent: 100 - totalPercent,
    })
    .filter((data): data is ChartDataItem => Boolean(data))
    .sort((a, b) => a.value - b.value);
};

export const getLineData = (reports: FinancialReportData[], type: SheetType) => {
  const dataKeySet = new Set<string>();
  const valueMap = new Map<string, Record<string, number>>();

  const data = reports
    .map((_, index) => {
      // 倒着计算
      const report = reports[reports.length - index - 1];
      const items = getValidItems(report, type);
      const entries = items.map(({ type, percent }) => [type, percent]).concat([['year', items[0].year]]);
      valueMap.set(items[0].year, Object.fromEntries(items.map(({ type, value }) => [type, value])));
      items.forEach(({ type }) => dataKeySet.add(type));
      return Object.fromEntries(entries) as Record<string, number>;
    })
    .flat();

  return {
    valueMap,
    data,
    dataKeys: Array.from(dataKeySet)
      .sort((a, b) => {
        const aIndex = data.findLastIndex((item) => a in item);
        const bIndex = data.findLastIndex((item) => b in item);
        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
        return data[aIndex][a] - data[bIndex][b];
      }),
  };
};

