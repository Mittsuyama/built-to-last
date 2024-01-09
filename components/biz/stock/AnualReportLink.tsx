'use client';
import { useMemoizedFn } from 'ahooks';
import { memo } from 'react';
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
    <div
      onClick={onClick}
      className="mb-3 w-full whitespace-nowrap overflow-hidden text-ellipsis hover:underline text-sm font-bold cursor-pointer underline-offset-4"
    >
      {title}
    </div>
  );
});

AnualReportLink.displayName = 'AnualReportLink';

