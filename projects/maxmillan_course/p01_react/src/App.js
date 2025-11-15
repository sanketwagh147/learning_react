import { useState } from 'react';
import './styles.css';

const buttons = [
  'Why React?',
  'Related Resources',
  'Core Features',
  'Vanilla Js',
  'Foo',
  'Choco Js',
  'Onion Js',
];
const content = [
  [
    'React is extremely popular',
    'It makes building complex, interactive UIs a breeze',
    "It's powerful & flexible",
    'It has a very active and versatile ecosystem',
  ],
  [
    'Components, JSX & Props',
    'State',
    'Hooks (e.g., useEffect())',
    'Dynamic rendering',
  ],
  [
    'Official web page (react.dev)',
    'Next.js (Fullstack framework)',
    'React Native (build native mobile apps with React)',
  ],
  [
    'Vanilla JavaScript requires imperative programming',
    'Imperative Programming: You define all the steps needed to achieve a result',
    'React on the other hand embraces declarative programming',
    'With React, you define the goal and React figures out how to get there',
  ],
  [
    'Vanilla JavaScript requires imperative programming',
    'Imperative Programming: You define all the steps needed to achieve a result',
    'React on the other hand embraces declarative programming',
    'With React, you define the goal and React figures out how to get there',
  ],
  ['foo bar', 'foobar 2', 'foo bar 4'],
  ['foo bar', 'foobar 2', 'foor bar 3', 'foo bar 4'],
];

export default function App() {
  const [activeContentIndex, setActiveContentIndex] = useState(0);

  let buttons_map = (buttonText, index) => (
    <button
      key={buttonText}
      className={activeContentIndex === index ? 'active' : ''}
      onClick={() => setActiveContentIndex(index)}
    >
      {buttonText}
    </button>
  );

  return (
    <div>
      <header>
        <img src="react-logo-xs.png" alt="React logo" />
        <div>
          <h1>React.js</h1>
          <p>i.e., using the React library for rendering the UI</p>
        </div>
      </header>

      <div id="tabs">
        <menu>{buttons.map(buttons_map)}</menu>
        <div id="tab-content">
          <ul>
            {content[activeContentIndex].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
