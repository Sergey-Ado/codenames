import { useEffect, useState } from 'react';

const onClick = () => {
  console.log('logo');
};

export function Logo() {
  const [text, setText] = useState('codenames');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 460) setText('cn');
      else setText('codenames');
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <span
        className="uppercase text-3xl font-perm text-third-light dark:text-amber-300 max-[450px]:my-1 text-shadow-[4px_4px_4px_rgb(0,0,0)] cursor-pointer"
        onClick={onClick}
        role="logo">
        {text}
      </span>
    </>
  );
}
