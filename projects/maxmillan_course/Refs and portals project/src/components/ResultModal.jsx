import { useRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';

export default function ResultModal({
  remainingTime,
  targetTime,
  onReset,
  ref,
}) {
  console.log('loaded ResultModal');
  const dialog = useRef();

  const userLost = remainingTime <= 0;
  const result = userLost ? 'Lost' : 'Won!!';
  const formattingTime = (remainingTime / 1000).toFixed(2);
  const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100);

  useImperativeHandle(ref, () => ({
    showModal() {
      dialog.current.showModal();
    },
  }));

  return createPortal(
    <dialog ref={dialog} className="result-modal" onClose={onReset}>
      <h2>You {result}</h2>
      {!userLost && <h2>Your score : {score} %</h2>}
      <p>Your target time : {targetTime} seconds</p>
      <p>
        You stopped the timer with{' '}
        <strong>{formattingTime} seconds left</strong>
      </p>
      <form method="dialog" onSubmit={onReset}>
        <button>Close</button>
      </form>
    </dialog>,
    document.getElementById('modal')
  );
}
