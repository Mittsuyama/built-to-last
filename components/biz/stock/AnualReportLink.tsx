'use client';
import { useMemoizedFn } from 'ahooks';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { fetchPdfUrl } from './fetchPdfUrl';

interface AnualReportLinkProps {
  art_code: string;
  title: string;
}

export const AnualReportLink = memo<AnualReportLinkProps>(({ art_code, title }) => {
  const onClick = useMemoizedFn(async () => {
    const link = await fetchPdfUrl(art_code);
    window.open(link);
  });

  return (
    <div onClick={onClick} className="mb-1 ">
      <Button variant="link" className='p-0 h-7'>
        {title}
      </Button>
    </div>
  );
});

AnualReportLink.displayName = 'AnualReportLink';

