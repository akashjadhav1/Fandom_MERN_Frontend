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
    <div className='w-[70%] m-auto'>
      <h2 className="text-2xl font-bold mb-3 mt-5 underline">Cast</h2>
      <div className="w-full">
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {[1, 2, 3, 4, 5].map((index) => (
              <CarouselItem key={index} className="pl-1 md:basis-1/3 lg:basis-1/4 basis-1/2">
                <div className="p-1">
                  <div className="rounded-xl shadow-yellow-200 shadow-md border-none">
                    <div className="flex items-center justify-center p-2">
                      <div>
                        <Skeleton className="w-[13rem] h-[13rem] rounded-full shadow-lg mb-2" />
                        <div className="text-md font-semibold text-center"><Skeleton /></div>
                        <div className="text-sm text-gray-400 text-center"><Skeleton /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  </>
);

export default MoviesOverviewSkeleton;
