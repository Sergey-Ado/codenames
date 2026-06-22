import { useEffect, useState } from 'react';

interface props {
  duration: number;
}

export function Timer({ duration }: props) {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    const onInterval = () => {
      setTime(time - 1);
    };
    const interval = setInterval(onInterval, 1000);

    return () => clearInterval(interval);
  }, [time, setTime]);

  return (
    <div>
      <span>{time}</span>
    </div>
  );
}
