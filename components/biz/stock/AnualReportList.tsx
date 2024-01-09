import { memo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnualReportLink } from './AnualReportLink';

interface AnualReportListProps {
  code: string;
}

interface AnnItem {
  /** 报告唯一 id */
  art_code: string;
  /** xxxx:2022年年度报告 */
  title: string;
  /** 发布报告日期 */
  notice_date: string;
}

export const AnualReportList = memo<AnualReportListProps>(async ({ code }) => {
  const url = 'https://np-anotice-stock.eastmoney.com/api/security/ann';
  const search = new URLSearchParams({
    sr: '-1',
    page_size: '200',
    page_index: '1',
    ann_type: 'A',
    stock_list: `${code}`,
    f_node: '1',
    s_node: '1',
  });
  const res = await (await fetch(`${url}?${search.toString()}`)).json();
  const list = (res.data.list as AnnItem[]).filter((item) => item.title.endsWith('年年度报告'));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="text-base lg:text-xl">
          公司年度报告
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {
          list.map(({ art_code, title, notice_date }) => (
            <div className="flex justify-between" key={art_code}>
              <AnualReportLink
                art_code={art_code}
                title={`${Number(notice_date.split(' ')[0].split('-')[0]) - 1} - ${title}`}
              />
              <div className="text-muted-foreground text-sm hidden lg:block">
                {notice_date.split(' ')[0]}
              </div>
            </div>
          ))
        }
      </CardContent>
    </Card>
  );
});

AnualReportList.displayName = 'AnualReportList';

