import { useState, useEffect } from 'react';
import axios from 'axios';

const apiURL = "https://fandom-mern.onrender.com/api/all/data"; // Adjust the base URL as needed

function useMedia(id) {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMediaData() {
      try {
        setLoading(true);
        const response = await axios.get(apiURL, { timeout: 10000 });
        if (isMounted) {
          
          
          // Access the correct property in the response object that contains the array
          const allData = response.data.data || [];
        

          // Ensure allData is an array
          if (Array.isArray(allData)) {
            // Log all the IDs to compare
            
            

            // Convert provided id to number for comparison
            const numericId = Number(id);
            

            const filteredMedia = allData.find((item) => item.id === numericId) || null;
            
            setMedia(filteredMedia);
            setError(null);
          } else {
            console.error('Expected allData to be an array, but got:', typeof allData);
            setError(new Error('Unexpected data format'));
          }
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

    if (id) {
      fetchMediaData();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { media, loading, error };
}

export default useMedia;