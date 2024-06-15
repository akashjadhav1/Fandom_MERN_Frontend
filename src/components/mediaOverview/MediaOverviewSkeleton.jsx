import { Skeleton } from '../ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const MoviesOverviewSkeleton = () => (
  <>
    <div className="flex flex-col md:flex-row w-full max-w-7xl m-auto p-5 shadow-gray-300 shadow-lg rounded">
      <div className="w-full md:w-1/2 lg:w-1/3">
        <Skeleton className="object-contain w-full h-auto rounded shadow-gray-600 shadow-lg" />
      </div>
      <div className="mt-10 md:mt-0 md:ml-10 w-full md:w-1/2 lg:w-2/3 text-center">
        <h1 className="text-3xl font-bold mb-4">
          <Skeleton />
        </h1>
        <hr />
        <div className="lg:text-xl mb-4 lg:p-10 pt-5 text-justify">
          <Skeleton count={3} />
        </div>
        <div className="flex flex-col lg:p-10 md:flex-row justify-between">
          <div className="text-md font-semibold mb-2 md:mb-0 text-start">
            Release Date: <span className="text-gray-400 ml-2"><Skeleton /></span>
          </div>
          <div className="flex items-center text-md font-semibold">
            Rating: <span className="flex text-gray-400 ml-2"><Skeleton /></span>
          </div>
        </div>
        <div className="mt-5">
          <Skeleton className="w-full" />
        </div>
      </div>
    </div>
   
  </>
);

export default MoviesOverviewSkeleton;
