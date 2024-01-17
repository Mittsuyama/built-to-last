import { memo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/components/ui/link-with-progress';
import { AssetLine, ReportDataLineCard } from '@/components/biz/ReportDataGraph/Line';
import { SheetType } from '@/components/biz/ReportDataGraph/common';
import {
  AnualReportList,
  ClientSideTitle,
  ToggleFavButton,
  Business,
  MllAndROE,
  ProfitabilityCard,
} from '@/components/biz/stock';
import { fetchTreeFinancialReportsData } from './fetchStockReportData';
import { fetchLeadingIndex } from './fetchStockLeadingIndex';
import { fetchStockDetail } from './fetchStockDetail';
import { fetchBoardList } from './fetchBoardList';

interface StockInfoPageProps {
  params: {
    slug: string[];
  };
}

const ReportBaseDataTable = dynamic(
  () => import('@/components/biz/stock/ReportBaseDataTable'),
  {
    loading: () => null,
  },
);

const StockBaseInfo = dynamic(
  () => import('@/components/biz/stock/StockBaseInfo'),
  {
    loading: () => null,
  },
);

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
  } = await fetchStockInfo(props);

  return (
    <>
      <ClientSideTitle title={name} />
      <div className="flex justify-between items-center mb-4 md:mb-6 gap-2">
        <div className="flex items-center gap-3 md:gap-6 flex-wrap">
          <div className="text-xl lg:text-3xl font-bold pl-1">{name}</div>
          <Badge className="text-xs lg:text-base hover:bg-primary cursor-default">{industry}</Badge>
          <StockBaseInfo name={name} stockId={stockId} />
        </div>
        <div className="hidden md:flex items-center gap-2 lg:gap-4 text-xs md:text-sm">
          <ToggleFavButton stockId={stockId} />
          <Link href={`https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=${sType}${code}#/cwfx`} target="_blank">
            <Button variant="outline">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 md:mb-6">
        <div className="min-h-[330px]">
          <MllAndROE reports={reports} />
        </div>
        <div className="min-h-[330px]">
          <ProfitabilityCard reports={reports} />
        </div>
        <div className="md:col-span-2 lg:col-span-1 min-h-[340px]">
          <Business stockId={stockId} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4 md:mb-6">
        {sheets.map((sheetType) => (
          <div className="min-h-[330px]" key={sheetType}>
            <AssetLine
              key={sheetType}
              reports={reports}
              sheetType={sheetType}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-4 md:mb-6 items-stretch">
        <div className="lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">
          <div className="min-h-[330px]">
            <ReportDataLineCard
              reports={reports}
              title="现金流量表"
              accountItemKeys={[
                'x-jyhdcsdxjllje-经营活动产生的现金流量净额',
                'x-tzhdcsdxjllje-投资活动产生的现金流量净额',
                'x-czhdcsdxjllje-筹资活动产生的现金流量净额',
              ]}
            />
          </div>
          <div className="h-[330px] overflow-x-hidden">
            <AnualReportList code={code} />
          </div>
        </div>
        <div className="lg:col-span-2 h-[330px]">
          <ReportBaseDataTable name={name} stockId={stockId} industry={industry} />
        </div>
      </div>
    </>
  );
});

StockDetail.displayName = 'StockDetail';

export default StockDetail;

