import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { auth, db } from '@/config/firebase'; 
import heartFilled from '@/assets/heartFill.svg';
import heartOutline from '@/assets/heart.svg';
import { renderStars } from '@/assets/renderStar';
import { doc, getDoc, setDoc } from "firebase/firestore";

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for TMDb images

function CardData({ data }) {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

console.log(data);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        // Fetch favorites from Firebase
        const fetchFavorites = async () => {
          try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const userData = docSnap.data();
              if (userData.favorites) {
                setFavorites(userData.favorites);
              }
            }
          } catch (error) {
            console.error('Error getting user favorites:', error);
          }
        };
        fetchFavorites();
      } else {
        setUser(null);
        setFavorites([]);
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const toggleFavorite = (movieId) => {
    if (!user) {
      navigate('/login'); // Redirect to login page if user is not logged in
      return;
    }

    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.includes(movieId)
        ? prevFavorites.filter(id => id !== movieId)
        : [...prevFavorites, movieId];
      
      saveFavoritesToFirebase(updatedFavorites);
      
      return updatedFavorites;
    });
  };

  const saveFavoritesToFirebase = async (favoritesList) => {
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          favorites: favoritesList
        }, { merge: true });
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  };

  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-full mx-5 mt-8'>
      {data.map((movie) => (
        <Card key={movie.id} className="max-w-[400px] cursor-pointer hover:shadow-xl transition-shadow duration-300 rounded">
          <CardHeader className="relative flex flex-col items-center justify-center h-[360px]">
            <div className="object-contain h-full">
              <Link to={`/moviesOverview/${movie.id}`}>
                <img 
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
                  alt={movie.title} 
                  className="object-contain w-full h-full rounded"
                />
              </Link>
            </div>
            {/* Render heart icon based on favorite status */}
            <img
              src={favorites.includes(movie.id) ? heartFilled : heartOutline}
              alt="heart"
              className="absolute top-2 right-2 w-7 cursor-pointer"
              onClick={() => toggleFavorite(movie.id)}
            />
          </CardHeader>
          <hr />
          <CardContent>
            <CardTitle className="text-lg font-bold mt-2 text-center">{movie.title}</CardTitle>
            <div className="flex justify-between">
              <p className='font-bold'>Ratings :</p>
              <p className='flex items-center'>{renderStars(movie.vote_average)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default CardData;
