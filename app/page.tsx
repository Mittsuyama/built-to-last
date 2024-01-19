import { Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickSearch } from '@/components/biz/QuickSearch';
import { GoodSentences } from '@/components/biz/home/GoodSentences';
import { SearchButton } from '@/components/biz/home/SearchButton';
import { Lucky } from '@/components/biz/Lucky/Lucky';

export default async function Home() {
  return (
    <main className="flex px-8 lg:px-16 flex-col justify-center items-start lg:items-center gap-8 w-full h-full">
      <div className="text-5xl lg:text-6xl font-extrabold font-serif tracking-[.2em]">
        基业长青
      </div>
      <GoodSentences seed={Math.random()} />
      <div className="text-gray-500 flex items-center gap-2 lg:gap-4">
        <SearchButton />
        <Lucky>
          <Button variant="outline" className="inline-flex items-center gap-2">
            <Dices className="w-4 h-4" />
            手气不错
          </Button>
        </Lucky>
      </div>
      <QuickSearch />
    </main>
  )
}

