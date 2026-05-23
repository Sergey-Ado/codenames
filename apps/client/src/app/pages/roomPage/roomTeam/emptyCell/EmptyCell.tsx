import clsx from 'clsx';

interface props {
  callback: () => void;
}

export function EmptyCell({ callback }: props) {
  return (
    <div
      className={clsx(
        'w-full max-w-100 h-10.5 rounded-lg',
        'bg-primary-light dark:bg-primary-dark',
        'hover:bg-hover-light dark:hover:bg-hover-dark hover:cursor-pointer duration-200'
      )}
      onClick={callback}
      role="empty-cell"></div>
  );
}
