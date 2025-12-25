import EventForm from '../components/EventForm';
import { useRouteLoaderData } from 'react-router-dom';
function EditEvent() {
  const data = useRouteLoaderData('event-detail');
  return (<EventForm method="PATCH" event={data.event} />);
}

export default EditEvent;