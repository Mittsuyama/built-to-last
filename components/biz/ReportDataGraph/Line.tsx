'use client';
import { memo, useMemo, ReactNode } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { formatFinancialNumber } from '@/lib/format';
import { CommonGraphProps, sheetType2Title, totalKeyRecord, SheetType, getLineData, sheetType2Keys } from './common';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ACCOUNT_ITEM } from '@/constants/account-item';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<Record<string, any>>;
  label?: string;
  valueMap: Map<string, Record<string, number>>;
  hiddenPercent?: boolean;
}

const CustomTooltip = ({ active, payload, valueMap, hiddenPercent }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="text-sm font-bold">
          {payload?.[0]?.payload?.year} 年
        </div>
        <div className="text-xs">
          {
            payload
              .sort((a, b) => b.value - a.value)
              .map((item) => (
                <div
                  className="flex gap-4"
                  style={{ color: item.stroke }}
                  key={item.dataKey}
                >
                  <div className="font-bold flex-1 whitespace-nowrap">
                    {item.dataKey}
                  </div>
                  {!hiddenPercent && (
                    <div className="flex-none w-[70px]">
                      {`${item.value.toFixed(2)}%`}
                    </div>
                  )}
                  <div className="flex-none w-[70px]">
                    {formatFinancialNumber(valueMap.get(item.payload?.year)?.[item.dataKey])}
                  </div>
                </div>
            ))
          }
        </div>
      </div>
    );
  }

  return null;
};

interface ReportDataLineCardProps extends CommonGraphProps {
  title: ReactNode;
  desc?: ReactNode;
  totals?: number[];
  accountItemKeys: Array<keyof typeof ACCOUNT_ITEM>;
  minPercent?: number;
}

export const ReportDataLineCard = memo<ReportDataLineCardProps>((props) => {
  const { title, desc, totals, reports, accountItemKeys, minPercent  } = props;

  const { data, dataKeys, valueMap } = useMemo(
    () => getLineData({ reports, accountItemKeys, totals, minPercent }),
    [reports, accountItemKeys, totals, minPercent],
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="text-base lg:text-xl">
          {title}
        </CardTitle>
        {desc && (
          <CardDescription>
            {desc}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} >
            <Tooltip content={<CustomTooltip valueMap={valueMap} hiddenPercent={!totals} />} />
            {
              dataKeys.map((dataKey, index) => {
                return (
                  <Line
                    connectNulls
                    key={dataKey}
                    type="monotone"
                    dataKey={dataKey}
                    strokeWidth={1.5}
                    dot={{ r: 2 }}
                    stroke={`hsl(var(--primary) / ${1 / dataKeys.length * ((dataKeys.length - index - 1) % dataKeys.length + 1)})`}
                  />
                );
              })
            }
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

ReportDataLineCard.displayName = 'ReportDataLineCard';

export const AssetLine = memo<CommonGraphProps & { sheetType: SheetType }>((props) => {
  const { reports, sheetType } = props;

  const total = Number(reports[0][ACCOUNT_ITEM[totalKeyRecord[sheetType]]]) || 0;
  const lastYearTotal = Number(reports[1][ACCOUNT_ITEM[totalKeyRecord[sheetType]]]) || 0;

  return (
    <ReportDataLineCard
      totals={reports.map((report) => Number(report[ACCOUNT_ITEM[totalKeyRecord[sheetType]]]) || 0)}
      reports={reports}
      title={sheetType2Title[sheetType]}
      desc={`${reports[0]['REPORT_YEAR']} 年￥${formatFinancialNumber(total)}，同比增长 ${((total - lastYearTotal) / lastYearTotal * 100).toFixed(2)}%`}
      accountItemKeys={sheetType2Keys[sheetType]}
      minPercent={5}
    />
  );
});

AssetLine.displayName = 'AssetLine';

