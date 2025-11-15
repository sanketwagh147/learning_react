import { useState } from 'react';
import { EXAMPLES } from '../../data';
import TabButton from '../../components/TabButton/TabButton';
import Section from '../../components/Section/Section';
import Tabs from '../Tabs/Tabs';

function Examples() {
  const [selectedTopic, setSelectedTopic] = useState();
  function handleSelect(selectedButton) {
    // selectedButton => 'Components', 'JSX', 'Props', 'State'
    console.log(selectedButton);
    setSelectedTopic(selectedButton);
  }

  let tabContent = <p>Please select a topic to see an example.</p>;

  if (selectedTopic) {
    tabContent = (
      <div id="tab-content">
        <h3>{EXAMPLES[selectedTopic]?.title}</h3>
        <p>{EXAMPLES[selectedTopic]?.description}</p>
        <pre>
          <code>{EXAMPLES[selectedTopic]?.code}</code>
        </pre>
      </div>
    );
  }

  return (
    <Section title="Examples" id="examples">
      <Tabs
        // buttonContainer="menu" can be used if we want to use other built-in HTML elements
        // buttonContainer={ButtonsContainer} looks for custom component
        buttons={
          <>
            <TabButton
              isSelected={selectedTopic === 'components'}
              onClick={() => handleSelect('components')}
            >
              Component
            </TabButton>
            <TabButton
              isSelected={selectedTopic === 'jsx'}
              onClick={() => handleSelect('jsx')}
            >
              JSX
            </TabButton>
            <TabButton
              isSelected={selectedTopic === 'props'}
              onClick={() => handleSelect('props')}
            >
              Props
            </TabButton>
            <TabButton
              isSelected={selectedTopic === 'state'}
              onClick={() => handleSelect('state')}
            >
              State
            </TabButton>
          </>
        }
      >
        {tabContent}
      </Tabs>
    </Section>
  );
}

export default Examples;
