import { useState } from 'react';
import { INVESTMENT_KEYS } from '../util/constants';

function UserInput({ userInput, onInputChange }) {
  return (
    <section id="user-input">
      <div className="input-group">
        <p>
          <label>Initial Investment</label>
          <input
            type="number"
            required
            value={userInput[INVESTMENT_KEYS.INITIAL_INVESTMENT]}
            onChange={(event) =>
              onInputChange(
                INVESTMENT_KEYS.INITIAL_INVESTMENT,
                event.target.value
              )
            }
          />
        </p>
        <p>
          <label>Annual Investment</label>
          <input
            type="number"
            required
            value={userInput[INVESTMENT_KEYS.ANNUAL_INVESTMENT]}
            onChange={(event) =>
              onInputChange(
                INVESTMENT_KEYS.ANNUAL_INVESTMENT,
                event.target.value
              )
            }
          />
        </p>
      </div>
      <div className="input-group">
        <p>
          <label>Expected Return</label>
          <input
            type="number"
            required
            value={userInput[INVESTMENT_KEYS.EXPECTED_RETURN]}
            onChange={(event) =>
              onInputChange(INVESTMENT_KEYS.EXPECTED_RETURN, event.target.value)
            }
          />
        </p>
        <p>
          <label>Duration</label>
          <input
            type="number"
            required
            value={userInput[INVESTMENT_KEYS.DURATION]}
            onChange={(event) =>
              onInputChange(INVESTMENT_KEYS.DURATION, event.target.value)
            }
          />
        </p>
      </div>
    </section>
  );
}

export default UserInput;
