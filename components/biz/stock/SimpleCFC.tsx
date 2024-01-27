'use client';

import { memo } from 'react';
import { BarChart, Bar, Tooltip, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { FinancialReportData } from '@/types';
import { formatFinancialNumber } from '@/lib/format';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ACCOUNT_ITEM } from '@/constants/account-item';

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="text-xs mb-1 text-muted-foreground">
          {data.name} 年
        </div>
        <div className="text-base font-bold">
          {formatFinancialNumber(data.value)}
        </div>
      </div>
    );
  }
  return null;
};

interface MllAndROEProps {
  reports: FinancialReportData[];
}

export const SimpleCFC = memo<MllAndROEProps>((props) => {
  const { reports } = props;

  const reversedReports = reports.map((_, index) => reports[reports.length - index - 1]);
  const cfc = reversedReports.map((item) => {
    const value = (
      Number(item[ACCOUNT_ITEM['x-jyhdcsdxjllje-经营活动产生的现金流量净额']])
        - Number(item[ACCOUNT_ITEM['x-gdzczjyqzczhscxswzczj-固定资产折旧、油气资产折耗、生产性生物资产折旧']])
        - Number(item[ACCOUNT_ITEM['x-wxzctx-无形资产摊销']])
    );

    return {
      name: item['REPORT_YEAR'],
      value,
    };
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="text-base lg:text-xl">
          简易计算的自由现金流
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-col lg:flex-row flex-1 flex items-stretch gap-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cfc} margin={{ left: 40, right: 40 }}>
            <XAxis scale="point" hide />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              activeBar={{ fill: 'hsl(var(--primary) / 0.5)' }}
              dataKey="value"
              fill="hsl(var(--primary))"
              background={{ fill: 'hsl(var(--background))' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

SimpleCFC.displayName = 'SimpleCFC';

