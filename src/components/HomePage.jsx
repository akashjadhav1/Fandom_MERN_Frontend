import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import CardData from "./card/CardData";
import useAllMediaData from "@/hooks/useAllMedia";
import CardSkeleton from "./card/CardSkeleton";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const { data, loading, error } = useAllMediaData(searchQuery);

  console.log(data);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.query.value;
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div>
      <form
        onSubmit={handleSearch}
        className="flex lg:w-[50%] lg:m-auto pt-[3%] mx-10"
      >
        <Input
          name="query"
          className="lg:rounded-xl rounded h-8 lg:h-10"
          placeholder="Search Movies & TV Shows"
        />
        <Button
          variant="outline"
          type="submit"
          className="mx-4 rounded h-8 lg:h-10"
        >
          Search
        </Button>
      </form>

      <div className="w-[70%] m-auto flex mt-8">
        <Button 
          size="sm"
          className={`mx-4 shadow-green-500 shadow-md rounded ${filter === 'all' ? 'shadow-orange-500 text-white' : ''}`}
          onClick={() => handleFilterChange("all")}
        >
          All
        </Button>
        <Button 
          size="sm"
          className={`mx-4 shadow-green-500 shadow-md rounded ${filter === 'movie' ? 'shadow-orange-500 text-white' : ''}`}
          onClick={() => handleFilterChange("movie")}
        >
          Movies
        </Button>
        <Button 
          size="sm"
          className={`mx-4 shadow-green-500 shadow-md rounded ${filter === 'tv' ? 'shadow-orange-500 text-white' : ''}`}
          onClick={() => handleFilterChange("tv")}
        >
          TV
        </Button>
      </div>

      <div className="w-[80%] m-auto">
      {loading && (
          <div className="lg:container mx-auto mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array(10)
                .fill()
                .map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
            </div>
          </div>
        )}
        {error && <div>Error: {error.message}</div>}
        {!loading && !error && <CardData trendingData={data} filter={filter} searchQuery={searchQuery} />}
      </div>
    </div>
  );
}

export default HomePage;
