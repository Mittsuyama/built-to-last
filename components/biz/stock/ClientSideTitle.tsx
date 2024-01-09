'use client';

import { memo, useEffect } from 'react';

interface ClientSideTitleProps {
  title: string;
}

export const ClientSideTitle = memo<ClientSideTitleProps>((props) => {
  const { title } = props;

  useEffect(
    () => {
      document.title = title;
    },
    [title],
  );

  return null;
});

ClientSideTitle.displayName = 'ClientSideTitle';

