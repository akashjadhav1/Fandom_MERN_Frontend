import { useState, useEffect } from 'react';
import axios from 'axios';

const apiURL = "https://fandom-mern.onrender.com/api/all/data"; // Adjust the base URL as needed

function useFavoriteMedia(ids) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMediaData() {
      try {
        setLoading(true);
        const response = await axios.get(apiURL, { timeout: 10000 });
        if (isMounted) {
          const allData = response.data.data || [];

          if (Array.isArray(allData)) {
            const numericIds = ids.map(Number);
            const filteredMedia = allData.filter((item) => numericIds.includes(item.id));
            setMedia(filteredMedia);
            setError(null);
          } else {
            console.error('Expected allData to be an array, but got:', typeof allData);
            setError(new Error('Unexpected data format'));
          }
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

    if (ids && ids.length > 0) {
      fetchMediaData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [ids]);

  return { media, loading, error };
}

export default useFavoriteMedia;