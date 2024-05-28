import { useState, useEffect } from 'react';

const apiBaseURL = "https://api.themoviedb.org/3";
const apiKey = "26be9c9d07c7ab9b3fb7bf75d291c9e9";

function useMovie(id) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        const res = await fetch(`${apiBaseURL}/movie/${id}?api_key=${apiKey}`);
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMovie();
    }
  }, [id]);

  return { movie, loading, error };
}

export default useMovie;
