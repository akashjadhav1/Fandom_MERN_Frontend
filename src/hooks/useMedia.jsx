import { useState, useEffect } from 'react';

const apiBaseURL = "https://api.themoviedb.org/3";
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

function useMedia(id) {
  const [media, setMedia] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is still mounted

    async function fetchMedia() {
      try {
        setLoading(true);

        // Fetch movie data
        const response = await fetch(`${apiBaseURL}/movie/${id}?api_key=${apiKey}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();

        if (isMounted) {
          setMedia(data);
          setError(null); // Clear any previous errors
        }
      } catch (error) {
        if (isMounted) {
          setError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    async function fetchCast() {
      try {
        // Fetch cast data for movies
        const response = await fetch(`${apiBaseURL}/movie/${id}/credits?api_key=${apiKey}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();

        if (isMounted) {
          setCast(data.cast);
        }
      } catch (error) {
        if (isMounted) {
          setError(error);
        }
      }
    }

    async function fetchVideos() {
      try {
        // Fetch videos data for movies
        const response = await fetch(`${apiBaseURL}/movie/${id}/videos?api_key=${apiKey}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();

        if (isMounted) {
          setVideos(data.results);
        }
      } catch (error) {
        if (isMounted) {
          setError(error);
        }
      }
    }

    if (id) {
      fetchMedia();
      fetchCast();
      fetchVideos();
    }

    return () => {
      isMounted = false; // Cleanup function to set the flag to false on unmount
    };
  }, [id]);

  return { media, cast, videos, loading, error };
}

export default useMedia;
