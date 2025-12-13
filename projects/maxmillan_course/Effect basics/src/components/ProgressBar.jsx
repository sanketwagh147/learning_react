import { useEffect, useState } from 'react';
export default function ProgressBar({ timer }) {
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Interval');

      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 5 : 0));
    }, 5);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <progress value={remainingTime} max={timer} className="text-stone-400" />
  );
}
