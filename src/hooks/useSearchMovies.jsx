import { useState, useEffect } from 'react';

const apiBaseURL = "https://api.themoviedb.org/3";
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

function useSearchMovies(searchQuery = "", filter = "all") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getMoviesData(query, filter) {
    try {
      setLoading(true);
      let endpoint;
      if (query) {
        endpoint = `${apiBaseURL}/search/movie?api_key=${apiKey}&query=${query}`;
      } else {
        switch (filter) {
          case "movies":
            endpoint = `${apiBaseURL}/trending/movie/week?api_key=${apiKey}`;
            break;
          case "tv":
            endpoint = `${apiBaseURL}/trending/tv/week?api_key=${apiKey}`;
            break;
          default:
            endpoint = `${apiBaseURL}/trending/all/week?api_key=${apiKey}`;
        }
      }
      const res = await fetch(endpoint);
      const actualData = await res.json();
      setData(actualData.results);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMoviesData(searchQuery, filter);
  }, [searchQuery, filter]);

  return { data, loading, error };
}

export default useSearchMovies;
