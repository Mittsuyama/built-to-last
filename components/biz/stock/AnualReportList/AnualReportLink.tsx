'use client';
import { memo, useState } from 'react';
import cls from 'classnames';
import { useMemoizedFn } from 'ahooks';
import { Spin } from '@/components/ui/Spin';
import { fetchPdfUrl } from './fetchPdfUrl';

interface AnualReportLinkProps {
  art_code: string;
  title: string;
}

export const AnualReportLink = memo<AnualReportLinkProps>(({ art_code, title }) => {
  const [loading, setLoading] = useState(false);

  const onClick = useMemoizedFn(async () => {
    try {
      setLoading(true);
      const link = await fetchPdfUrl(art_code);
      window.open(link);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div
      onClick={onClick}
      className={cls(
        'flex items-center gap-2 mb-3 w-full whitespace-nowrap overflow-hidden text-ellipsis hover:underline text-sm font-bold cursor-pointer underline-offset-4',
        {
          'text-muted-foreground pointer-events-none': loading,
        },
      )}
    >
      {loading && (<Spin className="w-4 h-4" />)}
      {title}
    </div>
  );
});

AnualReportLink.displayName = 'AnualReportLink';

