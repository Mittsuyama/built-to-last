import { memo } from 'react';
import cls from 'classnames';
import { Loader2 } from 'lucide-react';

interface SpinProps {
  className?: string
}

export const Spin = memo<SpinProps>((props) => {
  const { className } = props;

  return (
    <span className={cls(className, 'flex justify-center items-center animate-spin')}>
      <Loader2 />
    </span>
  );
});

