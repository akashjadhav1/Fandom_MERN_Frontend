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

  // Function to render stars based on the rating
  

  return (
    <div className="flex w-[70%] m-auto p-5 border rounded bg-gray-900">
      {movie && (
        <>
          <div className="w-full md:w-[60%] lg:w-[40%]">
            <img 
              src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
              alt={movie.title} 
              className="object-contain w-full h-[90%] rounded shadow-lg"
            />
          </div>
          <div className="mt-10 w-full md:w-[60%] lg:w-[40%] text-center">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <hr />
            <p className="text-xl mb-4 pt-5 text-justify">{movie.overview}</p>
            <div className='flex justify-between'>
              <p className="text-md font-semibold">Release Date: <span className='text-gray-400 mx-3'>{movie.release_date}</span> </p>
              <p className="flex items-center text-md font-semibold">Rating: <span className='flex text-gray-400 mx-3'>{renderStars(movie.vote_average)}</span> </p> {/* Render stars based on the movie's vote_average */}
            </div>
            <div className='mt-[25px]' >
              <Button variant="outline" className="w-full" >Watch Now</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MoviesOverview;
