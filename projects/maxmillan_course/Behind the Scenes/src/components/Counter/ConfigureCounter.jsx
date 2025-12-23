import { useState } from 'react';
import { log } from '../../log.js';

export default function ConfigureCounter({ onSet }) {
  log('<ConfigureCounter /> rendered');
  const [enteredNumber, setEnteredNumber] = useState(null);

  function handleChange(event) {
    setEnteredNumber(+event.target.value);
  }

  function handleSet() {
    onSet(enteredNumber);
    setEnteredNumber(0);
  }

  return (
    <section id="configure-counter">
      <h2>Set Counter</h2>
      <input type="number" onChange={handleChange} value={enteredNumber} />
      <button onClick={handleSet}>Set</button>
    </section>
  );
}
