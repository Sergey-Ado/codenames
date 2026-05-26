import clsx from 'clsx';

interface props {
  callback: () => void;
  size?: number;
}

export function EmptyCell({ callback, size }: props) {
  const maxW = size ? `max-w-[${size}px]` : 'max-w-1000';

  return (
    <div
      className={clsx(
        'w-full h-10.5 rounded-lg',
        maxW,
        'bg-primary-light dark:bg-primary-dark',
        'hover:bg-hover-light dark:hover:bg-hover-dark hover:cursor-pointer duration-200'
      )}
      onClick={callback}
      role="empty-cell"></div>
  );
}
