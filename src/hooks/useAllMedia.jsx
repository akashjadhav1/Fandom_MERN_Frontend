import { useState, useEffect } from 'react';
import axios from 'axios';

const apiURL = "https://fandom-mern.onrender.com/api/all/data";

function useAllMediaData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrendingData() {
      try {
        setLoading(true);
        const response = await axios.get(apiURL, { timeout: 10000 });
        if (isMounted) {
          setData(response.data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch media data:', err);
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTrendingData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}

export default useAllMediaData;
