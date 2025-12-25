import { Link, useSubmit } from 'react-router-dom';
import classes from './EventItem.module.css';

function EventItem({ event }) {

  const submit = useSubmit();
  console.log(event);
  
  function startDeleteHandler() {
    const proceed = window.confirm('Are you sure?');
    if (proceed) {
      // send a request to delete the event
      console.log('Deleting...');
      submit(null, { method: 'delete' });
    } 
    // ...
  }

  return (
    <article className={classes.event}>
      <img src={event.image} alt={event.title} />
      <h1>{event.title}</h1>
      <time>{event.date}</time>
      <p>{event.description}</p>
      <menu className={classes.actions}>
        <Link to="edit">Edit</Link>
        <button onClick={startDeleteHandler}>Delete</button>
      </menu>
    </article>
  );
}

export default EventItem;
