import { Skeleton } from "../ui/skeleton";
import { Card,CardHeader,CardContent } from "../ui/card";

const CardSkeleton = () => (
  <Card className="cursor-pointer hover:shadow-xl transition-shadow duration-300 border-none bg-gray-800 shadow-white shadow-md rounded">
    <CardHeader className="relative flex flex-col items-center justify-center lg:h-[300px]">
      <div className="object-contain h-full">
        <Skeleton className="object-contain w-full h-full rounded" />
      </div>
      <Skeleton className="absolute top-2 right-2 lg:w-7 md:w-6 w-5" />
    </CardHeader>
    <hr />
    <CardContent>
      <Skeleton className="lg:text-lg lg:font-bold mt-2 lg:text-center text-sm h-6 w-3/4 mx-auto" />
      <div className="flex justify-between pt-2">
        <Skeleton className="lg:font-bold text-[10px] lg:text-lg h-4 w-1/4" />
        <Skeleton className="flex lg:mt-1.5 lg:mx-1 lg:w-auto w-14 h-4" />
      </div>
    </CardContent>
  </Card>
);

export default CardSkeleton;
