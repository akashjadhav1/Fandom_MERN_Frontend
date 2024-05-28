import { useState, useEffect } from 'react';

const apiBaseURL = "https://api.themoviedb.org/3";
const apiKey = "26be9c9d07c7ab9b3fb7bf75d291c9e9";

function useSearchMovies(searchQuery = "") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getMoviesData(query) {
    try {
      setLoading(true);
      const endpoint = query 
        ? `${apiBaseURL}/search/movie?api_key=${apiKey}&query=${query}`
        : `${apiBaseURL}/movie/popular?api_key=${apiKey}`;
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
    getMoviesData(searchQuery);
  }, [searchQuery]);

  return { data, loading, error };
}

export default useSearchMovies;
