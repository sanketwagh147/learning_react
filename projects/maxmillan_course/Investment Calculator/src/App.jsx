import Header from './Components/Header';
import Results from './Components/Results';
import UserInput from './Components/UserInput';
import { INVESTMENT_KEYS } from './util/constants';
import { useState } from 'react';

function App() {
  const [userInput, setUserInput] = useState({
    [INVESTMENT_KEYS.INITIAL_INVESTMENT]: 15000,
    [INVESTMENT_KEYS.ANNUAL_INVESTMENT]: 1200,
    [INVESTMENT_KEYS.EXPECTED_RETURN]: 6,
    [INVESTMENT_KEYS.DURATION]: 10,
  });

  function handleInputChange(inputIdentifier, newValue) {
    setUserInput((prevUserInput) => ({
      ...prevUserInput,
      // + converts the string value from input to a number
      // This is a unary operator that coerces the string to a numeric type.
      // Use empty string if no value, otherwise convert to number
      [inputIdentifier]: newValue === '' ? '' : +newValue,
    }));
  }
  const inputIsValid = userInput.duration >= 1;

  return (
    <>
      <Header />
      <UserInput userInput={userInput} onInputChange={handleInputChange} />
      {inputIsValid && <Results data={userInput} />}
      {!inputIsValid && (
        <p className="center">Please enter duration greater than 0</p>
      )}
    </>
  );
}

export default App;
