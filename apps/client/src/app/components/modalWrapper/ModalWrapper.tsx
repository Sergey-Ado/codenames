import clsx from 'clsx';
import React, { useEffect } from 'react';

interface props {
  children: React.ReactNode;
}

export function ModalWrapper({ children }: props) {
  useEffect(() => {
    document.body.classList.add('no-scroll');

    return () => document.body.classList.remove('no-scroll');
  });

  return (
    <div
      className={clsx(
        'fixed left-0 top-0 size-full',
        'bg-[#00000034] backdrop-blur-[2px]',
        'flex justify-center items-center'
      )}>
      {children}
    </div>
  );
}
