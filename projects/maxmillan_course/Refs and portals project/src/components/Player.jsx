import { useState, useRef } from 'react';

export default function Player() {
  const playerInputRef = useRef();
  const [playerName, setEnteredName] = useState('');

  function handleClick() {
    setEnteredName(playerInputRef.current.value);
  }

  return (
    <section id="player">
      <h2>Welcome {playerName ?? 'unknown'} entity</h2>
      <p>
        <input type="text" ref={playerInputRef} />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}
