'use client';
import { memo, useMemo } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BizItem } from './fetchBusiness';
import { formatFinancialNumber } from '@/lib/format';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<Record<string, any>>;
  label?: string;
  total: number;
}

const CustomTooltip = ({ active, payload, total }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { name, payload: data } = payload[0] || {};
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="text-base font-bold">
          {name}
        </div>
        <div className="text-sm">
          <div className="flex">
            <div className="w-[70px]">营业收入: </div>
            <div>{formatFinancialNumber(data['MAIN_BUSINESS_INCOME'])}</div>
          </div>
          <div className="flex">
            <div className="w-[70px]">收入占比: </div>
            <div>{(data['MAIN_BUSINESS_INCOME'] / total * 100).toFixed(2)}%</div>
          </div>
          <div className="flex">
            <div className="w-[70px]">毛利率: </div>
            <div>{(data['GROSS_RPOFIT_RATIO'] * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const BizPie = memo((props: { data: BizItem[]; title: string; }) => {
  const { data, title } = props;

  const total = useMemo(
    () => data.reduce((pre, cur) => pre + cur.MAIN_BUSINESS_INCOME, 0),
    [data],
  );

  return (
    <div className='w-full h-full flex flex-col items-center'>
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              nameKey="ITEM_NAME"
              dataKey="MAIN_BUSINESS_INCOME"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.ITEM_NAME}
                  fill={`hsl(var(--primary) / ${1 / data.length * ((data.length - index - 1) % data.length + 1)})`}
                  stroke="hsl(var(--primary-foreground))"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={total} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-none text-sm text-muted-foreground">
        {title}
      </div>
    </div>
  );
});

BizPie.displayName = 'BizPie';

export { BizPie as Pie };

