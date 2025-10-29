
"use client";

import { useSearch } from './search-provider';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import SearchBar from './search-bar';


const Header = ({ showTitle, activeArchive, headerPosition, headerAlignment, searchBarPosition }) => {
    return (
        showTitle && activeArchive ? (
            <div
              className={cn(
                "space-y-4 py-8 md:py-12",
                headerPosition === 'hero' && "bg-card rounded-3xl mb-8"
              )}
            >
              <div
                className={cn(
                  "flex flex-col gap-2 container mx-auto px-4 sm:px-6 lg:px-8",
                  headerAlignment === 'left' && 'items-start text-left',
                  headerAlignment === 'center' && 'items-center text-center',
                  headerAlignment === 'right' && 'items-end text-right'
                )}
              >
                <h1 className="text-4xl font-bold text-foreground">
                  {activeArchive.name}
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  {activeArchive.description}
                </p>
              </div>
      
              {(searchBarPosition === 'header' ||
                searchBarPosition === 'header-left' ||
                searchBarPosition === 'header-right') && (
                <div
                  className={cn(
                    "flex pt-4 container mx-auto px-4 sm:px-6 lg:px-8",
                    searchBarPosition === 'header' && 'justify-center',
                    searchBarPosition === 'header-left' && 'justify-start',
                    searchBarPosition === 'header-right' && 'justify-end'
                  )}
                >
                  <SearchBar />
                </div>
              )}
            </div>
          ) : null
    )
}

export default Header;
