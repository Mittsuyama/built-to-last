'use client';
import { memo, useMemo } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { formatFinancialNumber } from '@/lib/format';
import { getLineData, CommonGraphProps, sheetType2Title, totalKeyRecord } from './common';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { ACCOUNT_ITEM } from '@/constants/account-item';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<Record<string, any>>;
  label?: string;
  valueMap: Map<string, Record<string, number>>;
}

const CustomTooltip = ({ active, payload, valueMap }: CustomTooltipProps) => {
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
                  <div className="flex-none w-[70px]">
                    {`${item.value.toFixed(2)}%`}
                  </div>
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

const ReportDataLine = memo((props: CommonGraphProps) => {
  const { reports, type } = props;

  const { data, dataKeys, valueMap } = useMemo(
    () => getLineData(reports, type),
    [reports, type],
  );

  const total = Number(reports[0][ACCOUNT_ITEM[totalKeyRecord[type]]]) || 0;
  const lastYearTotal = Number(reports[1][ACCOUNT_ITEM[totalKeyRecord[type]]]) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base lg:text-xl">
          {sheetType2Title[type]}
        </CardTitle>
        <CardDescription>
          {`￥${formatFinancialNumber(total)}，同比增长 ${((total - lastYearTotal) / lastYearTotal * 100).toFixed(2)}%`}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[150px] lg:h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} >
            <Tooltip content={<CustomTooltip valueMap={valueMap} />} />
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
                    stroke={`hsl(var(--primary) / ${1 / dataKeys.length * (index % dataKeys.length + 1)})`}
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

ReportDataLine.displayName = 'ReportDataLine';

export { ReportDataLine as Line, };

