
"use client";

import { useSearch } from './search-provider';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

const SearchBar = () => {
    const { searchQuery, setSearchQuery } = useSearch();
    return (
        <div className="relative w-full max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts by title, content, or tag..."
          className="w-full rounded-full bg-card pl-12 h-12 text-base shadow-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    )
}

export default SearchBar;
