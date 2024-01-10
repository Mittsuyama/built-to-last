import { memo } from 'react';
import { CommonGraphProps } from '@/components/biz/ReportDataGraph/common';
import { ReportDataLineCard } from '@/components/biz/ReportDataGraph/Line';
import { ACCOUNT_ITEM } from '@/constants/account-item';
import { formatFinancialNumber } from '@/lib/format';
import { FinancialReportData } from '@/types';

const getNumberFromReport = (report: FinancialReportData, key: keyof typeof ACCOUNT_ITEM) => {
  return Number(report[ACCOUNT_ITEM[key]]) || 0;
};

export const ProfitabilityCard = memo<CommonGraphProps>(({ reports }) => {
  const total = getNumberFromReport(reports[0], 'l-yysr-营业收入');
  const lastYearTotal = getNumberFromReport(reports[1], 'l-yysr-营业收入');
  const mlr = getNumberFromReport(reports[0], 'l-yysr-营业收入') - getNumberFromReport(reports[0], 'l-yycb-营业成本');

  return (
    <ReportDataLineCard
      totals={reports.map((report) => getNumberFromReport(report, 'l-yysr-营业收入') - getNumberFromReport(report, 'l-yycb-营业成本'))}
      reports={reports}
      title="主营业务费用构成"
      desc={`${reports[0]['REPORT_YEAR']} 年营业收入￥${formatFinancialNumber(total)} (毛利润 ${formatFinancialNumber(mlr)})，同比增长 ${((total - lastYearTotal) / lastYearTotal * 100).toFixed(2)}%`}
      accountItemKeys={[
        'l-xsfy-销售费用',
        'l-glfy-管理费用',
        'l-yffy-研发费用',
        'l-lxfy-利息费用',
      ]}
    />
  );
});

ProfitabilityCard.displayName = 'ProfitabilityCard';

