import { memo } from 'react';
import { fetchIndustryInfo } from './fetchIndustryInfo';
import { formatFinancialNumber } from '@/lib/format';

interface ReportBaseDataTableProps {
  stockId: string;
  name: string;
}

const StockBaseInfo = memo<ReportBaseDataTableProps>(async ({ stockId, name }) => {
  const list = await fetchIndustryInfo(stockId, name);
  const { pe, totalMarketCap } = list[0];

  return (
    <div className="flex gap-3 md:gap-6 text-sm text-muted-foreground">
      <div>
        <span>TTM PE : </span>
        <span className="font-bold">{pe.toFixed(2)}</span>
      </div>
      <div>
        <span>总市值 : </span>
        <span className="font-bold">{formatFinancialNumber(totalMarketCap)}</span>
      </div>
    </div>
  );
});

StockBaseInfo.displayName = 'StockBaseInfo';

export default StockBaseInfo;

