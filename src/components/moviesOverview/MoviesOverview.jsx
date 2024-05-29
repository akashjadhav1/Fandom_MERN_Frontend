import { useParams } from 'react-router-dom';
import useMovie from '@/hooks/useMovies'; // Adjust the path as necessary
import { Button } from '@/components/ui/button';
import { renderStars } from '@/assets/renderStar';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for TMDb images

function MoviesOverview() {
  const { id } = useParams();
  const { movie, loading, error } = useMovie(id);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div
      className={`flex flex-col md:flex-row w-full max-w-7xl m-auto p-5 shadow-gray-300 shadow-lg rounded`}
    
    >
      {movie && (
        <>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <img 
              src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
              alt={movie.title} 
              className="object-contain w-full h-auto rounded shadow-gray-600 shadow-lg"
            />
          </div>
          <div className="mt-10 md:mt-0 md:ml-10 w-full md:w-1/2 lg:w-2/3 text-center">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <hr />
            <p className="lg:text-xl mb-4 lg:p-10 pt-5 text-justify">{movie.overview}</p>
            <div className="flex flex-col lg:p-10 md:flex-row justify-between">
              <p className="text-md font-semibold mb-2 md:mb-0 text-start">
                Release Date: <span className="text-gray-400 ml-2">{movie.release_date}</span>
              </p>
              <p className="flex items-center text-md font-semibold">
                Rating: <span className="flex text-gray-400 ml-2">{renderStars(movie.vote_average)}</span>
              </p>
            </div>
            <div className="mt-5">
              <Button variant="outline" className="w-full">Watch Now</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MoviesOverview;
