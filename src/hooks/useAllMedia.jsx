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
        const response = await axios.get(apiURL, { timeout: 35000 }); // Increased timeout to 20000ms
        if (isMounted) {
          setData(response.data || []);
          setError(null);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
        } else if (err.code === 'ECONNABORTED') {
          console.error('Request timeout:', err);
        } else {
          console.error('Failed to fetch media data:', err);
        }
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
