import { useState } from 'react';

export function LangSwitch() {
  const [isLeft, setIsLeft] = useState(true);

  const onClick = () => setIsLeft(!isLeft);

  return (
    <div className="bg-blue-600 w-20 h-11 rounded-full flex items-center text-xl text-white relative border-2">
      <div className="ml-2.5 cursor-pointer" onClick={onClick}>
        en
      </div>
      <div className="ml-2.5 cursor-pointer" onClick={onClick}>
        ru
      </div>
      <div
        className={`bg-white w-8 h-8 rounded-full absolute left-${isLeft ? 1 : 10} cursor-auto duration-200`}></div>
    </div>
  );
}
