import { useEffect, useState } from 'react';

function useFetch(fetchFn, initialValue) {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  const [fetchedData, setFetchedData] = useState(initialValue);
  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const fetchedData = await fetchFn();
        setFetchedData(fetchedData);
        setIsFetching(false);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong while fetching data.');
      }
    }
    fetchData();
  }, [fetchFn]);

  return {
    fetchedData,
    setFetchedData,
    isFetching,
    setIsFetching,
    setError,
    error,
  };
}

export default useFetch;
