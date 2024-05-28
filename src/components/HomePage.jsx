import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from './ui/button';
import CardData from './card/CardData';
import useSearchMovies from "@/hooks/useSearchMovies";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading, error } = useSearchMovies(searchQuery);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.query.value;
    setSearchQuery(query);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className='flex w-[50%] m-auto mt-[5%]'>
        <Input name="query" className="rounded-full" placeholder="Search Movies & TV Shows" />
        <Button variant="outline" type="submit" className="mx-4 rounded">
          Search
        </Button>
      </form>
      <div className='w-[80%] m-auto mt-5'>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {!loading && !error && (
          <CardData data={data} />
        )}
      </div>
    </div>
  );
}

export default HomePage;
