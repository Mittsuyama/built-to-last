import { memo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchBusiness } from './fetchBusiness';
import { Pie } from './Pie';

interface BusinessProps {
  stockId: string;
}

const Business = memo<BusinessProps>(async ({ stockId }) => {
  const { bizListByDistrict, bizListByProduct } = await fetchBusiness(stockId);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="text-base lg:text-xl">
          主营业务分析
        </CardTitle>
        <CardDescription>
          业务收入比例和毛利
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex items-stretch px-4">
        <div className="flex-1">
          <Pie data={bizListByProduct} title="按产品分类" />
        </div>
        <div className="flex-1">
          <Pie data={bizListByDistrict} title="按地区分类" />
        </div>
      </CardContent>
    </Card>
  );
});

Business.displayName = 'Business';

export default Business;

