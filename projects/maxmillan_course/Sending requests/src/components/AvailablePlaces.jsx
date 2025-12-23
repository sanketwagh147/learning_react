import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
import useFetch from '../hooks/useFetch.js';

const fetchAndSortPlaces = async () => {
  const placesData = await fetchAvailablePlaces();
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const sortedPlaces = sortPlacesByDistance(
          placesData,
          position.coords.latitude,
          position.coords.longitude
        );
        resolve(sortedPlaces);
      },
      () => {
        // If location access is denied or fails, return unsorted places
        reject(placesData);
      }
    );
  });
};

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    fetchedData: availablePlaces,
    isFetching,
    error,
  } = useFetch(fetchAndSortPlaces, []);

  if (error) {
    return <ErrorPage title="An error occurred!" message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      loadingText="Loading places..."
      onSelectPlace={onSelectPlace}
      isLoading={isFetching}
    />
  );
}
