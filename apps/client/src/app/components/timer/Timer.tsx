import { useEffect, useState } from 'react';

interface props {
  duration: number;
}

export function Timer({ duration }: props) {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t - 1), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-timer">
      <span role="timer-value">{time}</span>
    </div>
  );
}
