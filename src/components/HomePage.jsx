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

<form onSubmit={handleSearch} className='flex lg:w-[50%] lg:m-auto lg:pt-[3%] mx-10'>
  <Input name="query" className="lg:rounded-full rounded h-8 lg:h-10" placeholder="Search Movies & TV Shows" />
  <Button variant="outline" type="submit" className="mx-4 rounded h-8 lg:h-10">
    Search
  </Button>
</form>
<div className='w-[80%] m-auto'>
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
