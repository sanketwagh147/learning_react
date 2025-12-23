export async function fetchAvailablePlaces() {
  const url_ = 'http://localhost:3000/places';
  const response = await fetch(url_);
  const placesData = await response.json();
  if (!response.ok) {
    throw new Error(
      `The request failed with status ${response.status} and message received from server is ${placesData.message}`
    );
  }

  return placesData.places;
}

export async function fetchUserPlaces() {
  const url_ = 'http://localhost:3000/user-places';
  const response = await fetch(url_);
  const placesData = await response.json();
  if (!response.ok) {
    throw new Error(
      `The request failed with status ${response.status} and message received from server is ${placesData.message}`
    );
  }

  return placesData.places;
}

export async function updateUserPlaces(places) {
  const url_ = 'http://localhost:3000/user-places';
  const response = await fetch(url_, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ places }),
  });
  const resultData = await response.json();
  if (!response.ok) {
    throw new Error(
      `The request failed with status ${response.status} and message received from server is ${resultData.message}`
    );
  }

  return resultData.message;
}
