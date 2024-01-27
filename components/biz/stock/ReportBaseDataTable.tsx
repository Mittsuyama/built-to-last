import { memo } from 'react';
import cls from 'classnames';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchIndustryInfo } from './fetchIndustryInfo';
import { formatFinancialNumber } from '@/lib/format';

interface ReportBaseDataTableProps {
  stockId: string;
  name: string;
  industry: string;
}

const ReportBaseDataTable = memo<ReportBaseDataTableProps>(async ({ stockId, name, industry }) => {
  const list = await fetchIndustryInfo(stockId, name);
  const names = [name, '行业平均', '行业中值'];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base lg:text-xl">
          同行比较
        </CardTitle>
        <CardDescription>
          {`${industry}行业比较`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[90px]">描述</TableHead>
              <TableHead className="min-w-[90px]">TTM PE</TableHead>
              <TableHead className="min-w-[100px]">平均 ROE</TableHead>
              <TableHead>净利率</TableHead>
              <TableHead className="min-w-[100px]">市值</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              list.map((item, index) => (
                <TableRow key={names[index]} className={cls({ 'font-bold': !index })}>
                  <TableCell>{names[index]}</TableCell>
                  <TableCell>{formatFinancialNumber(item.pe)}</TableCell>
                  <TableCell>{formatFinancialNumber(item.roe, { unit: '%' })}</TableCell>
                  <TableCell>{formatFinancialNumber(item.netProfitRate, { unit: '%' })}</TableCell>
                  <TableCell>{formatFinancialNumber(item.totalMarketCap)}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
});

ReportBaseDataTable.displayName = 'ReportBaseDataTable';

export default ReportBaseDataTable;

