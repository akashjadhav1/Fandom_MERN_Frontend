import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { renderStars } from '@/assets/renderStar';
import CardSkeleton from './card/CardSkeleton';
import { Button } from './ui/button';
import axios from 'axios';
import Cookies from 'js-cookie';
import useFavoriteMedia from '@/hooks/useFavoriteMedia';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for TMDb images

function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { media, loading, error } = useFavoriteMedia(favoriteIds);

  useEffect(() => {
    // Fetch favorite media IDs from the server
    const fetchFavorites = async () => {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          throw new Error("No token found in cookies");
        }

        const response = await axios.get(
          "https://fandom-mern.onrender.com/api/user/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavoriteIds(response.data.favorites || []); // Ensure favorites is always an array of IDs
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  // Show loading skeletons while data is being fetched
  if (loading) {
    return (
      <div className="lg:container mx-auto mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array(10)
            .fill()
            .map((_, index) => (
              <CardSkeleton key={index} />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-3 '>All Favorites </h1>
        <hr />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 max-w-full mx-5 mt-8'>
        {media.length > 0 ? (
          media.map((movie) => (
            <Card key={movie.id} className="cursor-pointer hover:shadow-xl transition-shadow duration-300 border-none bg-black shadow-white shadow-md rounded">
              <CardHeader className="relative flex flex-col items-center justify-center lg:h-[200px]">
                <div className="object-contain h-full">
                  <Link to={`/mediaOverview/${movie.id}`}>
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
                <CardTitle className="lg:text-md lg:font-bold mt-2 lg:text-center text-sm truncate">
                  {movie.title || movie.name}
                </CardTitle>
                <div className="flex justify-between pt-2">
                  <p className='lg:font-bold text-[10px] lg:mt-1.5 lg:text-md'>Rating:</p>
                  <p className='flex lg:mt-1.5 lg:mx-1 lg:w-16 w-10'>{renderStars(movie.vote_average)}</p>
                </div>
                <div className='lg:flex lg:justify-center lg:items-center mt-3'>
                  <Link to={`/mediaOverview/${movie.media_type}/${movie.id}`}>
                    <Button size="sm" className="shadow-green-500 shadow-sm h-8 w-full lg:mt-0 mt-3">Watch Now</Button>
                  </Link>
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
