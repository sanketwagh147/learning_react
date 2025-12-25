// Challenge / Exercise

// 1. Add five new (dummy) page components (content can be simple <h1> elements)
//    - HomePage
//    - EventsPage
//    - EventDetailPage
//    - NewEventPage
//    - EditEventPage
// 2. Add routing & route definitions for these five pages
//    - / => HomePage
//    - /events => EventsPage
//    - /events/<some-id> => EventDetailPage
//    - /events/new => NewEventPage
//    - /events/<some-id>/edit => EditEventPage
// 3. Add a root layout that adds the <MainNavigation> component above all page components
// 4. Add properly working links to the MainNavigation
// 5. Ensure that the links in MainNavigation receive an "active" class when active
// 6. Output a list of dummy events to the EventsPage
//    Every list item should include a link to the respective EventDetailPage
// 7. Output the ID of the selected event on the EventDetailPage
// BONUS: Add another (nested) layout route that adds the <EventNavigation> component above all /events... page components

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Events, { loader as eventLoader } from './pages/Events';
import { loader as eventDetailLoader, action as deleteEventAction } from './pages/EventDetails';
import EventDetails from './pages/EventDetails';
import NewEvent  from './pages/NewEvent';
import { action as manipulateEventAction } from './components/EventForm';
import { action as newsletterAction } from './components/NewsLetter';
import EditEvent from './pages/EditEvent';
import Root from './Root';
import EventsRootLayout from './pages/EventsRoot';
import ErrorPage from './pages/ErrorPage';
import NewsletterPage from './components/NewsLetter';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'events',
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <Events />,
            loader: eventLoader,
          },
          {
            path: ':eventId',
            // element: <EventDetails />, // No need to specify element here since we have children routes
            id: 'event-detail',
            loader: eventDetailLoader,
            children: [
              { index: true, element: <EventDetails />, action: deleteEventAction },
              { path: 'edit', element: <EditEvent />, action : manipulateEventAction},
            ],
          },
          { path: 'new', element: <NewEvent /> ,action: manipulateEventAction},
        ],
      },
      {
        path:'newsletter',
        element:<NewsletterPage />,
        action: newsletterAction,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
