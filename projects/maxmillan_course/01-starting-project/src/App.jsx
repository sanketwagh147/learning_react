import { Header, CoreConcept, Examples } from './components';

function App() {
  return (
    // <Fragment> or <> both are same
    <>
      <Header headerText={'React Essentials'}></Header>
      <main>
        <CoreConcept />
        <Examples />
      </main>
    </>
    // </Fragment>
  );
}

export default App;
