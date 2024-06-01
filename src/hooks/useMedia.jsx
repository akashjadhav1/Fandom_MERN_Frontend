import { useState, useEffect } from 'react';

const apiBaseURL = "https://api.themoviedb.org/3";
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options; // Default timeout of 8 seconds
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);
  return response;
}

function useMedia(id, mediaType) {
  const [media, setMedia] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData(url, setter) {
      try {
        setLoading(true);
        let retries = 3;
        let success = false;
        let data;

        while (retries > 0 && !success) {
          try {
            const response = await fetchWithTimeout(url);
            if (!response.ok) {
              throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            data = await response.json();
            success = true;
          } catch (err) {
            retries--;
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
