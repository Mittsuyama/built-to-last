import { memo } from 'react';
import { Github, Dices } from 'lucide-react';
import { Link } from '@/components/ui/link-with-progress';
import { Button } from '@/components/ui/button';
import { StockDetailMenu } from '@/components/biz/StockDetail/DetailMenu';
import StockDetail from '@/components/biz/StockDetail/StockDetail';
import { Search } from '@/components/biz/stock/Search';
import { ThemeToggle } from '@/components/biz/layout/ThemeToggle';
import { Lucky } from '@/components/biz/Lucky/Lucky';

interface StockInfoPageProps {
  params: {
    slug: string[];
  };
}

const StockInfoPage = memo<StockInfoPageProps>(async (props) => {
  const [sType, code] = props.params.slug;

  return (
    <div>
      <header className="flex justify-between items-center pl-2 pr-4 md:px-4 lg:px-10 border-b h-16">
        <div className="flex items-center gap-2 text-primary/70 hover:text-primary/50">
          <div className="md:hidden flex items-center">
            <StockDetailMenu code={code} sType={sType} />
          </div>
          <Link
            className="font-extrabold font-serif tracking-wide md:px-2 text-primary hover:text-primary/80"
            href="/"
          >
            基业长青
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:block" />
          <Lucky className="hidden md:block">
            <Button variant="ghost" size="icon">
              <Dices className="w-5 h-5" />
            </Button>
          </Lucky>
          <Link className="hidden md:block" href="https://github.com/Mittsuyama/built-to-last" target="_blank">
            <Button variant="ghost" size="icon">
              <Github className="w-5 h-5" />
            </Button>
          </Link>
          <Search className="w-[120px] md:w-[200px]" />
        </div>
      </header>
      <main className="px-4 lg:px-10 py-4 lg:py-8">
        <StockDetail {...props} />
      </main>
    </div>
  );
});

StockInfoPage.displayName = 'StockInfoPage';

export default StockInfoPage;

