import { useState, useEffect } from 'react';
import axios from 'axios';

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
      let actualData;

      while (retries > 0 && !actualData) {
        try {
          const res = await axios.get(endpoint, { timeout: 20000 }); // Increased timeout to 30 seconds
          actualData = res.data;
        } catch (err) {
          retries--;
          console.error(`Fetch attempt failed. Retries left: ${retries}`, err);
          if (err.response) {
            console.error(`Error response data: ${JSON.stringify(err.response.data)}`);
            console.error(`Error response status: ${err.response.status}`);
            console.error(`Error response headers: ${JSON.stringify(err.response.headers)}`);
          } else if (err.request) {
            console.error(`Error request data: ${JSON.stringify(err.request)}`);
          } else {
            console.error(`Error message: ${err.message}`);
          }
          if (retries === 0) {
            throw err;
          }
        }
      }

      const filteredData = actualData.results.filter(item => item.media_type !== "person");
      setData(filteredData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch movies data:', err);
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
