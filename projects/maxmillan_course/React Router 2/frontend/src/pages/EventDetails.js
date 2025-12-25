// import { useParams } from "react-router-dom";
import { redirect, useRouteLoaderData,Await } from "react-router-dom";
import { Suspense } from "react";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";

function EventDetails() {
  const {event, events} = useRouteLoaderData('event-detail');
  console.log("Event Details");
  

  // const params = useParams();

  return (
    <>
    <Suspense fallback={<p style={{textAlign:'center'}}>Loading event...</p>}>
    <Await resolve={event}>
      {(loadedEvent) => <EventItem event={loadedEvent}/>}
    </Await>
    </Suspense>
    <Suspense fallback={<p style={{textAlign:'center'}}>Loading events...</p>}>
    <Await resolve={events}>
      {(loadedEvents) => <EventsList events={loadedEvents} />}
    </Await>
    </Suspense>
    </>
  );
}

export default EventDetails;


export async function loadEvent(eventId) {

  console.log("Event ID in loader:", eventId);
  const response =  await fetch('http://localhost:8080/events/' + eventId);
  console.log((await response).status);
  

  if (!response.ok) {
    throw new Response('Could not fetch details for selected event.', {
      status: 500,
    });
  } else {
    console.log(response);
    
    const resData = await response.json();
    return resData.event;
  }

}
export async function loadEvents() {

  // we can use local storage or fetch from a backend server in loader functions but we cannot use useEffect or useState here or hooks
  // any other default brwowser API can be used here 
  const response = await fetch('http://localhost:8080/events');

  if (!response.ok) {
    // setError('Fetching events failed.');
    throw new Response(response.statusText, { status: response.status });
  } else {
    const resData = await response.json();
    console.log(resData);
    
    return resData.events;
  }
}

export async function loader({ request, params }) {
  const eventId = params.eventId;
  // add await to loadEvent to resolve before returning without await it will load in background
  return {event: await loadEvent(eventId) , events: loadEvents()  };
}

export async function action({ request, params }) {

  const response = await fetch('http://localhost:8080/events/' + params.eventId,{
    method: request.method,
  });

  if (!response.ok) {
    // setError('Fetching events failed.');
    throw new Response(response.statusText, { status: response.status });
  } else {
    return redirect('/events');
  }
}
