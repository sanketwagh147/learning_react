import { useCallback, useEffect, useState } from 'react';

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Request failed!');
  }

  return resData;
}
export default function useHttp(url, config, initialData) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialData);

  function clearData() {
    setData(initialData);
  }

  const sendRequest = useCallback(
    async function sendRequest(data) {
      setLoading(true);
      try {
        const resData = await sendHttpRequest(url, {
          ...config,
          body: JSON.stringify(data),
        });
        setData(resData);
      } catch (err) {
        setError(err.message || 'Something went wrong!');
      }
      setLoading(false);
    },
    [url]
  );

  useEffect(() => {
    if (config && (config.method === 'GET' || !config.method)) {
      sendRequest();
    }
  }, [sendRequest]);

  return { data, loading, error, sendRequest, clearData };
}
