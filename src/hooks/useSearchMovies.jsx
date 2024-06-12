import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const apiBaseURL = "https://api.themoviedb.org/3";
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

// Debounce function to limit the rate of API calls
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function useSearchMovies(searchQuery = "", filter = "all") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cache = useRef({}); // Using useRef for caching

  const debouncedQuery = useDebounce(searchQuery, 500); // Debouncing input

  async function getMoviesData(query, filter) {
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

    // Check the cache first
    if (cache.current[endpoint]) {
      setData(cache.current[endpoint]);
      setLoading(false);
      return;
    }

    console.log('Fetching data from:', endpoint);

    let retries = 3;
    let delay = 1000; // Initial delay of 1 second for exponential backoff

    const fetchData = async () => {
      try {
        const res = await axios.get(endpoint, { timeout: 30000, params: { page: 1 } }); // Request first page
        const filteredData = res.data.results
          .filter(item => item.media_type !== "person")
          .slice(0, 20); // Limit to top 20 results

        // Cache the result
        cache.current[endpoint] = filteredData;
        setData(filteredData);
        setError(null);
        setLoading(false); // Set loading false here only after successful fetch
      } catch (err) {
        console.error(`Fetch attempt failed. Retries left: ${retries}`, err);

        if (retries > 0) {
          retries -= 1;
          console.log(`Retrying in ${delay / 1000} seconds...`);
          setTimeout(fetchData, delay);
          delay *= 2; // Exponential backoff
        } else {
          console.error('Failed to fetch movies data:', err);
          setError('Failed to fetch data after multiple attempts. Please check your internet connection.');
          setLoading(false); // Set loading false here after all retries are exhausted
        }
      }
    };

    fetchData();
  }

  useEffect(() => {
    getMoviesData(debouncedQuery, filter);
  }, [debouncedQuery, filter]);

  return { data, loading, error };
}

export default useSearchMovies;
