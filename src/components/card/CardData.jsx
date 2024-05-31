import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { auth, db } from '@/config/firebase'; 
import heartFilled from '@/assets/heartFill.svg';
import heartOutline from '@/assets/heart.svg';
import { renderStars } from '@/assets/renderStar';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Button } from '../ui/button';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for TMDb images

function CardData({ data }) {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

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

  const isFavorite = (item) => {
    return favorites.some(fav => fav.id === item.id && fav.media_type === item.media_type);
  };

  const addToFavorites = async (item) => {
    if (!user) {
      navigate('/login'); // Redirect to login page if user is not logged in
      return;
    }
  
    const { id, media_type } = item; // Get the ID and media type of the item
  
    // Check if id and media_type are defined
    if (!id || !media_type) {
      console.error('Invalid item data:', item);
      return;
    }

    // Update the favorites array in Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), {
        favorites: arrayUnion({ id, media_type })
      }, { merge: true });
      // Update the local state
      setFavorites(prevFavorites => [...prevFavorites, { id, media_type }]);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };
  
  const removeFromFavorites = async (id, media_type) => {
    if (!user) {
      navigate('/login'); // Redirect to login page if user is not logged in
      return;
    }

    // Check if id and media_type are defined
    if (!id || !media_type) {
      console.error('Invalid item data:', { id, media_type });
      return;
    }

    // Remove the item from favorites array in Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), {
        favorites: arrayRemove({ id, media_type })
      }, { merge: true });
      // Update the local state
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id || fav.media_type !== media_type));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <div className='lg:container mx-auto mt-8'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
        {data.map((item) => (
          <Card key={item.id} className="cursor-pointer hover:shadow-xl transition-shadow duration-300 border-none bg-black shadow-white shadow-md rounded">
            <CardHeader className="relative flex flex-col items-center justify-center lg:h-[210px] h-[150px]">
              <div className="object-contain h-full">
                <Link to={`/mediaOverview/${item.media_type}/${item.id}`}>
                  <img 
                    src={`${IMAGE_BASE_URL}${item.poster_path}`} 
                    alt={item.title || item.name} 
                    className="object-contain w-full h-full rounded"
                  />
                </Link>
              </div>
              {/* Add onClick to trigger addToFavorites */}
              <img
                src={isFavorite(item) ? heartFilled : heartOutline}
                alt="heart"
                className="absolute top-2 right-2 lg:w-7 md:w-6 w-5 cursor-pointer"
                onClick={() => {
                  if (isFavorite(item)) {
                    removeFromFavorites(item.id, item.media_type);
                  } else {
                    addToFavorites(item);
                  }
                }} 
              />
            </CardHeader>
            <hr />
            <CardContent>
              <CardTitle className="lg:text-md lg:font-bold mt-2 lg:text-center text-sm truncate">{item.title || item.name}</CardTitle>
              <div className="flex justify-between pt-2">
                <p className='lg:font-bold text-[10px] lg:text-md mt-0.5'>Rating:</p>
                <p className='flex lg:w-auto w-14'>{renderStars(item.vote_average)}</p>
              </div>
              <div className='lg:flex lg:justify-between lg:items-center md:flex md:justify-between md:items-center mt-3'>
                <Button size="sm" className=' shadow-orange-500 shadow-sm lg:w-auto w-full h-8 lg:mt-0 mt-3'>{item.media_type ? item.media_type.toUpperCase() : 'N/A'}</Button>
                <Link to={`/mediaOverview/${item.media_type}/${item.id}`}>
                  <Button size="sm" className="shadow-green-500 shadow-sm lg:w-auto w-full  h-8 lg:mt-0 mt-3">Watch Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CardData;
