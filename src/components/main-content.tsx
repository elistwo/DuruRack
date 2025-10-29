
"use client";

import { useSearch } from './search-provider';
import { cn } from '@/lib/utils';
import { Search, Book } from 'lucide-react';
import { Input } from './ui/input';
import { PostCard } from './post-card';
import { TagCloud } from './tag-cloud';
import SearchBar from './search-bar';

const MainContent = ({ searchBarPosition, tagCloudOptions, allTags, selectedTag, setSelectedTag, filteredPosts, layout, activeArchive, setSelectedPostId, setViewingPostInModal, searchQuery }) => {
    return (
        <>
      {(searchBarPosition === 'top-center' ||
        searchBarPosition === 'top-left' ||
        searchBarPosition === 'top-right') && (
        <div
          className={cn(
            "mb-6 flex",
            searchBarPosition === 'top-center' && 'justify-center',
            searchBarPosition === 'top-left' && 'justify-start',
            searchBarPosition === 'top-right' && 'justify-end'
          )}
        >
          <SearchBar />
        </div>
      )}

      {tagCloudOptions.show !== false &&
        tagCloudOptions.position === 'top-of-content' && (
          <div className="mb-8">
            <TagCloud
              title={tagCloudOptions.title}
              tags={allTags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
            />
          </div>
        )}

      {filteredPosts.length > 0 ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-6 sm:grid-cols-2",
            layout.startsWith('portal')
              ? "lg:grid-cols-2 xl:grid-cols-3"
              : "md:grid-cols-3 xl:grid-cols-4"
          )}
        >
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onSelect={() => setSelectedPostId(post.id)}
              onExpand={() => setViewingPostInModal(post)}
              displayOptions={activeArchive?.displayOptions}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[calc(100vh-20rem)] flex-col items-center justify-center text-center">
          <div className="mx-auto max-w-md">
            {searchQuery || selectedTag ? (
              <>
                <Search className="mx-auto mb-4 size-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">No Results Found</h2>
                <p className="mt-2 text-muted-foreground">
                  Your search or filter did not return any results.
                </p>
              </>
            ) : (
              <>
                <Book className="mx-auto mb-4 size-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">
                  This archive is empty
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Click the 'New Post' button to create your first post.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {tagCloudOptions.show !== false &&
        tagCloudOptions.position === 'bottom-of-content' && (
          <div className="mt-12">
            <TagCloud
              title={tagCloudOptions.title}
              tags={allTags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
            />
          </div>
        )}
    </>
    )
}

export default MainContent;
