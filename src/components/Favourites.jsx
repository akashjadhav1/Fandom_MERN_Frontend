import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { auth, db } from '@/config/firebase'; // Import Firebase config
import { renderStars } from '@/assets/renderStar';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for TMDb images

function Favorites() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to handle UI state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchFavorites(user);
      } else {
        setLoading(false); // No user is signed in, set loading to false
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const fetchFavorites = async (user) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.favorites) {
          fetchFavoriteMovies(userData.favorites);
        }
      }
    } catch (error) {
      console.error('Error getting user favorites:', error);
    }
    setLoading(false); // Set loading to false after fetching data
  };

  const fetchFavoriteMovies = async (favorites) => {
    const requests = favorites.map(id =>
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`).then(response => response.json())
    );
    const results = await Promise.all(requests);
    setMovies(results);
  };

  if (loading) {
    return <p className='text-center'>Loading...</p>; // Show a loading message while fetching data
  }

  return (
    <div className="container mx-auto mt-8">
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-3 '>All Favourites</h1>
        <hr />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-full mx-5 mt-8'>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Card key={movie.id} className="cursor-pointer hover:shadow-xl transition-shadow  duration-300 border-none bg-black shadow-white shadow-md rounded">
              <CardHeader className="relative flex flex-col items-center justify-center lg:h-[300px] ">
                <div className="object-contain h-full">
                  <Link to={`/moviesOverview/${movie.id}`}>
                    <img 
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
                      alt={movie.title} 
                      className="object-contain w-full h-full rounded"
                    />
                  </Link>
                </div>
              </CardHeader>
              <hr />
              <CardContent>
              <CardTitle className="lg:text-lg lg:font-bold mt-2 lg:text-center text-sm">{movie.title}</CardTitle>
              <div className="flex justify-between pt-2 ">
                <p className='lg:font-bold text-[10px] lg:text-lg'>Rating:</p>
                <p className='flex lg:mt-1.5 lg:mx-1 lg:w-auto w-14'>{renderStars(movie.vote_average)}</p>
              </div>
            </CardContent>
            </Card>
          ))
        ) : (
          <p>No favorites found</p>
        )}
      </div>
    </div>
  );
}

export default Favorites;
