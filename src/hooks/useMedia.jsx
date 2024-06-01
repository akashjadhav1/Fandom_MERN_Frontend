import { useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseURL = "https://api.themoviedb.org/3";
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

function useMedia(id, mediaType) {
  const [media, setMedia] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is still mounted

    async function fetchData(url, setter) {
      try {
        setLoading(true);
        let retries = 3;
        let data;

        while (retries > 0 && !data) {
          try {
            const response = await axios.get(url, { timeout: 8000 });
            data = response.data;
          } catch (err) {
            retries--;
            console.error(`Fetch attempt failed. Retries left: ${retries}`, err);
            if (retries === 0) {
              throw err;
            }
          }
        }

        if (isMounted) {
          setter(data);
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

    if (id && mediaType) {
      fetchData(`${apiBaseURL}/${mediaType}/${id}?api_key=${apiKey}`, setMedia);
      fetchData(`${apiBaseURL}/${mediaType}/${id}/credits?api_key=${apiKey}`, (data) => setCast(data.cast));
      fetchData(`${apiBaseURL}/${mediaType}/${id}/videos?api_key=${apiKey}`, (data) => setVideos(data.results));
    }

    return () => {
      isMounted = false;
    };
  }, [id, mediaType]);

  return { media, cast, videos, loading, error };
}

export default useMedia;
