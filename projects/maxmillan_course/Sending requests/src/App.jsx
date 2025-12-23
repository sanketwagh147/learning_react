import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import { updateUserPlaces, fetchUserPlaces } from './http.js';
import useFetch from './hooks/useFetch.js';

function App() {
  const selectedPlace = useRef();

  const {
    fetchedData: userPlaces,
    isFetching,
    error: errorUpdatingPlaces,
    setError: setErrorUpdatingPlaces,
    setFetchedData: setUserPlaces,
    setIsFetching,
  } = useFetch(fetchUserPlaces, []);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await updateUserPlaces([...userPlaces, selectedPlace]);
    } catch (err) {
      console.error(err);
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces(
        err.message || 'Something went wrong while updating places.'
      );
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      try {
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (err) {
        console.error(err);
        setUserPlaces(userPlaces);
        setErrorUpdatingPlaces(
          err.message || 'Something went wrong while updating places.'
        );
      }

      setModalIsOpen(false);
    },
    [userPlaces, setUserPlaces, setErrorUpdatingPlaces]
  );

  return (
    <>
      <Modal
        open={!!errorUpdatingPlaces}
        onClose={() => setErrorUpdatingPlaces(false)}
      >
        {errorUpdatingPlaces && (
          <ErrorPage
            title="Error Updating Places"
            message={errorUpdatingPlaces}
            onConfirm={() => setErrorUpdatingPlaces(false)}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {errorUpdatingPlaces && (
          <ErrorPage title="An error occurred!" message={errorUpdatingPlaces} />
        )}
        {!errorUpdatingPlaces && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            loadingText="Loading your places..."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        {/* <AvailablePlaces /> */}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
