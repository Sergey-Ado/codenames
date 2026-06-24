import clsx from 'clsx';

interface props {
  callback: () => void;
  small?: boolean;
}

export function EmptyCell({ callback, small = false }: props) {
  const maxW = small ? 'max-w-[43.6px]' : 'max-w-100';

  return (
    <div
      className={clsx(
        'w-full h-[43.6px] rounded-lg border',
        maxW,
        'bg-primary-light dark:bg-primary-dark',
        'hover:bg-hover-light dark:hover:bg-hover-dark hover:cursor-pointer duration-200'
      )}
      onClick={callback}
      role="empty-cell"></div>
  );
}
