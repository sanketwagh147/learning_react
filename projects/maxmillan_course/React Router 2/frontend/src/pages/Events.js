import { useLoaderData, Await } from 'react-router-dom';
import { Suspense } from 'react';

import EventsList from '../components/EventsList';

function Events() {
  const data = useLoaderData();



  if (data.isError) {
    return <p>{data.message}</p>;
  }
  const events = data.events;

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading....</p>} >
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default Events;



export async function loadEvents() {

  // we can use local storage or fetch from a backend server in loader functions but we cannot use useEffect or useState here or hooks
  // any other default brwowser API can be used here 
  const response = await fetch('http://localhost:8080/events');

  if (!response.ok) {
    // setError('Fetching events failed.');
    throw new Response(response.statusText, { status: response.status });
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

export async function loader() {
  // must have a promise returned
  return {events: loadEvents() };
}
