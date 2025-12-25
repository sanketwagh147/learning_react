import MainNavigation from "../components/MainNavigation";
import PageContent from "../components/PageContent";
import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  let title = 'An Error Occurred!';
  let message = 'Something went wrong!';

  console.log(error.status);
  

  if (error.status === 500) {
    title = 'Server Error!';
    message = 'There was a problem with the server.';
  }

  if (error.status === 404) {
    title = 'Not Found';
    message = 'The page you are looking for does not exist.';
  }

  return (
    <>
    <MainNavigation/>
    <PageContent title={title}>
      <p>{message}</p>
    </PageContent>
    </>
  );
}

export default ErrorPage;