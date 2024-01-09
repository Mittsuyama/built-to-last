import { memo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfitabilityCard } from '@/components/biz/stock/ProfitabilityCard';
import { MllAndROE } from '@/components/biz/stock/MllAndROE';
import { AssetLine } from '@/components/biz/ReportDataGraph/Line';
import { SheetType } from '@/components/biz/ReportDataGraph/common';
import { Business } from '@/components/biz/stock/Business';
import { AnualReportList } from '@/components/biz/stock/AnualReportList';
import { ReportBaseDataTable } from '@/components/biz/stock/ReportBaseDataTable';
import { ClientSideTitle } from '@/components/biz/stock/ClientSideTitle';
import { fetchTreeFinancialReportsData } from './fetchStockReportData';
import { fetchLeadingIndex } from './fetchStockLeadingIndex';
import { fetchStockDetail } from './fetchStockDetail';
import { fetchBoardList } from './fetchBoardList';

interface StockInfoPageProps {
  params: {
    slug: string[];
  };
}

const fetchStockInfo = async (props: StockInfoPageProps) => {
  const { params } = props;
  const { slug } = params;
  const [sType, code] = slug;

  const stockId = `${code}.${sType.toUpperCase()}`;
  const [
    [reports],
    indexList,
    detail,
    boardList
  ] = await Promise.all([
    fetchTreeFinancialReportsData(
      [stockId],
      6,
    ),
    fetchLeadingIndex({ sType, code }),
    fetchStockDetail(stockId),
    fetchBoardList(stockId),
  ]);

  const industry = boardList.find((item) => item.type === '行业')?.name || 'Unknown';

  const info = {
    ...detail,
    stockId,
    sType,
    industry,
    reports: reports.map<Record<string, any>>((report, index) => ({
      ...report,
      ...indexList[index],
    })),
  };

  return info;
};

const sheets: SheetType[] = [
  'current-asset',
  'non-currnet-asset',
  'current-debt',
  'non-current-debt',
];

const StockDetail = memo<StockInfoPageProps>(async (props) => {
  const {
    name,
    reports,
    industry,
    sType,
    code,
    stockId,
    ttmPe,
    totalMarketCap,
  } = await fetchStockInfo(props);

  return (
    <>
      <ClientSideTitle title={name} />
      <div className="flex justify-between items-center mb-4 lg:mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="text-xl lg:text-3xl font-bold pl-1">{name}</div>
          <Badge className="text-xs lg:text-base hover:bg-primary cursor-default">{industry}</Badge>
          <div className="flex gap-4 text-sm md:text-base text-muted-foreground">
            <div>TTM PE : {ttmPe}</div>
            <div>总市值 : {totalMarketCap}</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 lg:gap-4 text-xs md:text-sm">
          <Link href={`https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=${sType}${code}#/cwfx`} target="_blank">
            <Button variant="default">
              其他数据
            </Button>
          </Link>
          <Link href={`https://data.eastmoney.com/notices/stock/${code}.html`} target="_blank">
            <Button variant="outline">
              公司公告
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 lg:mb-6">
        <MllAndROE reports={reports} />
        <ProfitabilityCard reports={reports} />
        <div className="md:col-span-2 lg:col-span-1 h-[340px]">
          <Business stockId={stockId} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4 lg:mb-6">
        {sheets.map((sheetType) => <AssetLine key={sheetType} reports={reports} sheetType={sheetType} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-4 lg:mb-6">
        <div className="grid lg:col-span-3 lg:grid-cols-2 gap-6">
          <div className=" h-[340px]">
            <AnualReportList code={code} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <ReportBaseDataTable name={name} stockId={stockId} industry={industry} />
        </div>
      </div>
    </>
  );
});

StockDetail.displayName = 'StockDetail';

export default StockDetail;

