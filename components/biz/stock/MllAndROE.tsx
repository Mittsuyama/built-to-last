'use client';
import { Separator } from '@/components/ui/separator';

import { memo, Fragment } from 'react';
import { BarChart, Bar, Tooltip, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { FinancialReportData } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="text-xs mb-1 text-muted-foreground">
          {data.name} 年
        </div>
        <div className="text-base font-bold">
          {data.value.toFixed(2)}%
        </div>
      </div>
    );
  }
  return null;
};

interface MllAndROEProps {
  reports: FinancialReportData[];
}

export const MllAndROE = memo<MllAndROEProps>((props) => {
  const { reports } = props;

  const roe = reports.map((item) => ({ name: item['REPORT_YEAR'], value: item['ROEKCJQ'] }))
  const mll = reports.map((item) => ({ name: item['REPORT_YEAR'], value: item['XSMLL'] }))
  const list = [
    {
      data: mll,
      name: '毛利率',
      domain: [0, 100],
    },
    {
      data: roe,
      name: '加权扣非 ROE',
      domain: [
        0,
        Math.max(
          roe.reduce((pre, cur) => typeof cur.value === 'number' && cur.value > pre ? cur.value : pre, Number.MIN_SAFE_INTEGER),
          50
        )
      ],
    },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="text-base lg:text-xl">
          毛利率和 ROE
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-col lg:flex-row flex-1 flex items-stretch gap-6 px-6 pb-4">
        {list.map(({ data, name, domain }, index) => (
          <Fragment key={name}>
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ left: 20, right: 20 }}>
                    <XAxis scale="point" hide />
                    <YAxis domain={domain} hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      activeBar={{ fill: 'hsl(var(--primary) / 0.5)' }}
                      dataKey="value"
                      fill="hsl(var(--primary)"
                      background={{ fill: 'hsl(var(--background))' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-none text-center text-muted-foreground text-xs mt-3">
                {name}
              </div>
            </div>
            {index !== list.length - 1 && (
              <>
                <Separator className="block lg:hidden" orientation="horizontal" />
                <Separator className="hidden lg:block" orientation="vertical" />
              </>
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
});

MllAndROE.displayName = 'MllAndROE';

