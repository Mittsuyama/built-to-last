import { memo } from 'react';
import pangu from 'pangu';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BusinessReviewAlert } from './BusinessReviewAlert';

interface BusinessProps {
  stockId: string;
}

const BusinessReview = memo<BusinessProps>(async ({ stockId }) => {
  const url = 'https://datacenter.eastmoney.com/securities/api/data/v1/get';
  const search = new URLSearchParams({
    reportName: 'RPT_F10_OP_BUSINESSANALYSIS',
    columns: 'SECUCODE,SECURITY_CODE,REPORT_DATE,BUSINESS_REVIEW',
    filter: `(SECUCODE="${stockId}")`,
    pageNumber: '1',
    pageSize: '1',
    source: 'HSF10',
    client: 'PC',
  });
  const res = await (await fetch(`${url}?${search.toString()}`)).json();
  const reviewText = res?.result?.data?.[0]['BUSINESS_REVIEW'] as string;
  const reviewSenteces = reviewText.split('。').filter(Boolean);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="text-base lg:text-xl mb-b-0">
          <span className="mr-3">
            经营评述
          </span>
          <BusinessReviewAlert reviewSenteces={reviewSenteces} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto text-base">
        {reviewSenteces.map((text) => (
          <p
            key={text}
            className="mb-2"
          >
            {pangu.spacing(text)}。
          </p>
        ))}
      </CardContent>
    </Card>
  );
});

BusinessReview.displayName = 'BusinessReview';

export default BusinessReview;

