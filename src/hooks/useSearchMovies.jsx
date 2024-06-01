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

function useSearchMovies(searchQuery = "", filter = "all") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getMoviesData(query, filter) {
    try {
      setLoading(true);
      let endpoint;
      if (query) {
        endpoint = `${apiBaseURL}/search/multi?api_key=${apiKey}&query=${query}`;
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
      console.log('Fetching data from:', endpoint);
      let retries = 3;
      let success = false;
      let actualData;

      while (retries > 0 && !success) {
        try {
          const res = await fetchWithTimeout(endpoint);
          if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
          }
          actualData = await res.json();
          success = true;
        } catch (err) {
          retries--;
          if (retries === 0) {
            throw err;
          }
        }
      }

      const filteredData = actualData.results.filter(item => item.media_type !== "person");
      setData(filteredData);
    } catch (err) {
      setError(err);
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
