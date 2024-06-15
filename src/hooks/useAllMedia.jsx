import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the API URL
const apiURL = "https://fandom-mern.onrender.com/api/all/data";


function useAllMediaData() {
 
  const [data, setData] = useState([]);
 
  const [loading, setLoading] = useState(true);
 
  const [error, setError] = useState(null);

  useEffect(() => {
    // To keep track if the component is mounted or not
    let isMounted = true;

    // Asynchronous function to fetch data from the API
    async function fetchTrendingData() {
      try {
        // Set loading to true before starting the fetch
        setLoading(true);
        // Fetch data from the API with a timeout of 30 seconds
        const response = await axios.get(apiURL, { timeout: 30000 }); 
        if (isMounted) {
          // If the component is still mounted, update the data state
          setData(response.data || []);
          // Clear any previous errors
          setError(null);
        }
      } catch (err) {
      
        if (axios.isCancel(err)) {
         
          console.log('Request canceled:', err.message);
        } else if (err.code === 'ECONNABORTED') {
        
          console.error('Request timeout:', err);
        } else {
        
          console.error('Failed to fetch media data:', err);
        }
        if (isMounted) {
          // If the component is still mounted, update the error state
          setError(err);
        }
      } finally {
        if (isMounted) {
        
          setLoading(false);
        }
      }
    }

    
    fetchTrendingData();

    // Cleanup function to set isMounted to false if the component unmounts
    return () => {
      isMounted = false;
    };
  }, []); 

  // Return the state variables for use in components
  return { data, loading, error };
}

export default useAllMediaData;
