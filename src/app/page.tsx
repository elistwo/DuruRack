
"use client";
import { useMemo, useRef, ChangeEvent, useEffect, useState } from "react";
import {
  Search,
  Book,
  FilePlus,
  Import,
  Upload,
  Sun,
  Moon,
  Library,
  Settings,
  Cog,
} from "lucide-react";
import { useArchive } from "@/hooks/use-archive";
import type { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostView } from "@/components/post-view";
import { WelcomeScreen } from "@/components/welcome-screen";
import { PostEditor } from "@/components/post-editor";
import { PostCard } from "@/components/post-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { ArchiveSidebar } from "@/components/archive-sidebar";
import { ArchiveSettings } from "@/components/archive-settings";
import { Badge } from "@/components/ui/badge";
import { PostModalView } from "@/components/post-modal-view";
import { PortalSidebar } from "@/components/portal-sidebar";
import { cn } from "@/lib/utils";
import { TagCloud } from "@/components/tag-cloud";
import { useSearch } from "@/components/search-provider";
import Header from "@/components/header";
import MainContent from "@/components/main-content";
import SearchBar from "@/components/search-bar";

function ThemeToggle({ side }: { side: 'left' | 'right' | 'top' | 'bottom' }) {
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-12 w-12" />; // Placeholder for SSR
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 shadow-lg"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>
        <p>Toggle Theme</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function Home() {
  const {
    archives,
    activeArchive,
    createAndActivateArchive,
    importArchive,
    importArchiveFromUrl,
    exportArchive,
  } = useArchive();
  const { searchQuery, setSearchQuery } = useSearch();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [viewingPostInModal, setViewingPostInModal] = useState<Post | null>(
    null
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayOptions = activeArchive?.displayOptions || {};
  const {
    layout = 'grid',
    searchBarPosition = 'top-center',
    showTitle = true,
    headerPosition = 'top',
    headerAlignment = 'center',
    actionButtonsPosition = 'bottom-right',
    actionButtonsDisplayMode = 'stacked',
    portalOptions = {},
    tagCloudOptions = {},
  } = displayOptions;

  const actionButtons = useMemo(
    () => ({
      theme: true,
      archives: true,
      settings: true,
      import: true,
      export: true,
      newPost: true,
      ...(activeArchive?.displayOptions?.actionButtons || {}),
    }),
    [activeArchive?.displayOptions?.actionButtons]
  );

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      await importArchive(Array.from(event.target.files));
      event.target.value = ""; // Reset file input
    }
  };

  const openNewPostEditor = () => {
    if (!activeArchive && archives.length === 0) {
      createAndActivateArchive();
    }
    setEditingPost(null);
    setEditorOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setEditorOpen(true);
    setSelectedPostId(null);
    setViewingPostInModal(null);
  };

  const handleExport = () => {
    if (activeArchive) {
      exportArchive(activeArchive.id);
    }
  };

  const allTags = useMemo(() => {
    if (!activeArchive) return [];
    const tags = new Set<string>();
    activeArchive.posts.forEach((post) => {
      post.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [activeArchive]);

  const filteredPosts = useMemo(() => {
    if (!activeArchive) return [];
    let posts = activeArchive.posts;

    if (selectedTag) {
      posts = posts.filter((post) => post.tags?.includes(selectedTag));
    }

    if (!searchQuery) return posts;

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [activeArchive, searchQuery, selectedTag]);

  const featuredPosts = useMemo(() => {
    if (!activeArchive || !portalOptions.featuredPostIds) return [];
    const featuredMap = new Map(
      portalOptions.featuredPostIds.map((id, index) => [id, index])
    );
    return activeArchive.posts
      .filter((post) => featuredMap.has(post.id))
      .sort(
        (a, b) =>
          (featuredMap.get(a.id) ?? Infinity) -
          (featuredMap.get(b.id) ?? Infinity)
      );
  }, [activeArchive, portalOptions.featuredPostIds]);

  const selectedPost = useMemo(() => {
    if (selectedPostId) {
      return activeArchive?.posts.find((p) => p.id === selectedPostId) ?? null;
    }
    return null;
  }, [activeArchive, selectedPostId]);

  useEffect(() => {
    setSelectedPostId(null);
  }, [activeArchive?.id]);

  if (!archives.length) {
    return (
      <>
        <WelcomeScreen
          onImportClick={handleImportClick}
          onNewPostClick={openNewPostEditor}
          onImportFromUrl={(url) => importArchiveFromUrl(url)}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".json"
          multiple
        />
      </>
    );
  }

  if (selectedPost) {
    return (
      <PostView
        post={selectedPost}
        onBack={() => setSelectedPostId(null)}
        onEdit={
          !activeArchive?.isOnline
            ? () => handleEditPost(selectedPost)
            : undefined
        }
      />
    );
  }

  // --- Reusable Components ---

  const ActionButtons = () => {
    const [fabOpen, setFabOpen] = useState(false);

    const isCentered = actionButtonsPosition.includes('center');
    const tooltipSide = actionButtonsPosition.includes('left')
      ? 'right'
      : actionButtonsPosition.includes('right')
      ? 'left'
      : 'top';

    const fabDirectionClass = isCentered
      ? 'flex-row'
      : actionButtonsPosition.includes('top')
      ? 'flex-col-reverse'
      : 'flex-col';

    const buttonListElements = [
      actionButtons.theme && <ThemeToggle key="theme" side={tooltipSide} />,
      actionButtons.archives && archives.length > 0 && (
        <Tooltip key="archives">
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                setSidebarOpen(true);
                setFabOpen(false);
              }}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
            >
              <Library className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>Manage Archives</p>
          </TooltipContent>
        </Tooltip>
      ),
      actionButtons.settings && activeArchive && !activeArchive.isOnline && (
        <Tooltip key="settings">
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                setSettingsOpen(true);
                setFabOpen(false);
              }}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>Archive Settings</p>
          </TooltipContent>
        </Tooltip>
      ),
      actionButtons.import && (
        <Tooltip key="import">
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                handleImportClick();
                setFabOpen(false);
              }}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
            >
              <Import className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>Import Archive</p>
          </TooltipContent>
        </Tooltip>
      ),
      actionButtons.export && (
        <Tooltip key="export">
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                handleExport();
                setFabOpen(false);
              }}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
              disabled={!activeArchive}
            >
              <Upload className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>Export Active Archive</p>
          </TooltipContent>
        </Tooltip>
      ),
      actionButtons.newPost && (
        <Tooltip key="newPost">
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                openNewPostEditor();
                setFabOpen(false);
              }}
              size="icon"
              className="rounded-full h-16 w-16 shadow-lg"
              disabled={activeArchive?.isOnline}
            >
              <FilePlus className="h-7 w-7" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>New Post</p>
          </TooltipContent>
        </Tooltip>
      ),
    ].filter(Boolean);

    const FabMenu = () => {
      if (isCentered) {
        const midPoint = Math.ceil(buttonListElements.length / 2);
        const leftButtons = buttonListElements.slice(0, midPoint);
        const rightButtons = buttonListElements.slice(midPoint);

        return (
          <div className="relative flex justify-center items-center">
            {/* The expanding buttons */}
            <div
              className={cn(
                'flex items-center gap-4 transition-all duration-300 ease-in-out',
                fabOpen
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95 pointer-events-none'
              )}
            >
              {/* Left side */}
              <div className="flex items-center gap-2">{leftButtons}</div>

              {/* Spacer element that will be hidden, but keeps the main button centered */}
              <div className="h-16 w-16" />

              {/* Right side */}
              <div className="flex items-center gap-2">{rightButtons}</div>
            </div>

            {/* The main FAB button, positioned absolutely to stay in the center */}
            <div className="absolute">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setFabOpen(!fabOpen)}
                    size="icon"
                    className="rounded-full h-16 w-16 shadow-lg z-10"
                  >
                    <Cog
                      className={cn(
                        'h-7 w-7 transition-transform duration-300',
                        fabOpen && 'rotate-90'
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={tooltipSide}>
                  <p>Actions</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        );
      }

      // Default FAB behavior for corner positions
      return (
        <div className={cn("relative flex items-center", fabDirectionClass)}>
          <div
            className={cn(
              "flex gap-2 transition-all duration-300 ease-in-out",
              fabDirectionClass,
              fabOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none -translate-y-2"
            )}
          >
            {buttonListElements}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setFabOpen(!fabOpen)}
                size="icon"
                className={cn(
                  "rounded-full h-16 w-16 shadow-lg",
                  fabDirectionClass === 'flex-col' ? 'mt-2' : 'ml-2'
                )}
              >
                <Cog
                  className={cn(
                    "h-7 w-7 transition-transform duration-300",
                    fabOpen && "rotate-90"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>
              <p>Actions</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    };

    return (
      <div
        className={cn(
          "fixed z-50",
          actionButtonsPosition === 'top-left' && 'top-6 left-6',
          actionButtonsPosition === 'top-right' && 'top-6 right-6',
          actionButtonsPosition === 'bottom-left' && 'bottom-6 left-6',
          actionButtonsPosition === 'bottom-right' && 'bottom-6 right-6',
          actionButtonsPosition === 'top-center' &&
            'top-6 left-1/2 -translate-x-1/2',
          actionButtonsPosition === 'bottom-center' &&
            'bottom-6 left-1/2 -translate-x-1/2'
        )}
      >
        <TooltipProvider>
          {actionButtonsDisplayMode === 'fab' ? (
            <FabMenu />
          ) : (
            <div
              className={cn("relative flex gap-2 items-center", fabDirectionClass)}
            >

              {buttonListElements}
            </div>
          )}
        </TooltipProvider>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div className="flex flex-col min-h-screen">
      <ArchiveSidebar open={isSidebarOpen} onOpenChange={setSidebarOpen} />
      <ArchiveSettings open={isSettingsOpen} onOpenChange={setSettingsOpen} />

      {headerPosition === 'top' && <Header showTitle={showTitle} activeArchive={activeArchive} headerPosition={headerPosition} headerAlignment={headerAlignment} searchBarPosition={searchBarPosition} />}

      <main className="flex-1 w-full container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {layout.startsWith('portal') ? (
          <div
            className={cn(
              "grid grid-cols-1 gap-8",
              layout === 'portal-left' && 'lg:grid-cols-[1fr_3fr]',
              layout === 'portal-right' && 'lg:grid-cols-[3fr_1fr]'
            )}
          >
            {layout === 'portal-left' ? (
              <>
                <aside>
                  {activeArchive && activeArchive.posts.length > 0 && (
                    <PortalSidebar
                      posts={featuredPosts}
                      portalOptions={portalOptions}
                      onPostSelect={(id) => setSelectedPostId(id)}
                      tags={allTags}
                      selectedTag={selectedTag}
                      onTagSelect={setSelectedTag}
                      tagCloudOptions={tagCloudOptions}
                    />
                  )}
                </aside>
                <div>
                  <MainContent searchBarPosition={searchBarPosition} tagCloudOptions={tagCloudOptions} allTags={allTags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} filteredPosts={filteredPosts} layout={layout} activeArchive={activeArchive} setSelectedPostId={setSelectedPostId} setViewingPostInModal={setViewingPostInModal} searchQuery={searchQuery} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <MainContent searchBarPosition={searchBarPosition} tagCloudOptions={tagCloudOptions} allTags={allTags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} filteredPosts={filteredPosts} layout={layout} activeArchive={activeArchive} setSelectedPostId={setSelectedPostId} setViewingPostInModal={setViewingPostInModal} searchQuery={searchQuery} />
                </div>
                <aside>
                  {activeArchive && activeArchive.posts.length > 0 && (
                    <PortalSidebar
                      posts={featuredPosts}
                      portalOptions={portalOptions}
                      onPostSelect={(id) => setSelectedPostId(id)}
                      tags={allTags}
                      selectedTag={selectedTag}
                      onTagSelect={setSelectedTag}
                      tagCloudOptions={tagCloudOptions}
                    />
                  )}
                </aside>
              </>
            )}
          </div>
        ) : (
          <MainContent searchBarPosition={searchBarPosition} tagCloudOptions={tagCloudOptions} allTags={allTags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} filteredPosts={filteredPosts} layout={layout} activeArchive={activeArchive} setSelectedPostId={setSelectedPostId} setViewingPostInModal={setViewingPostInModal} searchQuery={searchQuery} />
        )}
      </main>

      {(headerPosition === 'hero' || headerPosition === 'bottom') && (
        <Header showTitle={showTitle} activeArchive={activeArchive} headerPosition={headerPosition} headerAlignment={headerAlignment} searchBarPosition={searchBarPosition} />
      )}

      <ActionButtons />

      {searchBarPosition === 'floating-top-left' && (
        <div className="fixed top-6 left-6 z-50 w-full max-w-sm">
          <SearchBar />
        </div>
      )}
      {searchBarPosition === 'floating-top-right' && (
        <div className="fixed top-6 right-6 z-50 w-full max-w-sm">
          <SearchBar />
        </div>
      )}
      {searchBarPosition === 'floating-bottom-left' && (
        <div className="fixed bottom-6 left-6 z-50 w-full max-w-sm">
          <SearchBar />
        </div>
      )}
      {searchBarPosition === 'floating-bottom-right' &&
        actionButtonsPosition !== 'bottom-right' && (
          <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
            <SearchBar />
          </div>
        )}

      <PostEditor
        isOpen={isEditorOpen}
        setOpen={setEditorOpen}
        post={editingPost}
      />
      <PostModalView
        post={viewingPostInModal}
        isOpen={!!viewingPostInModal}
        onOpenChange={(isOpen) => !isOpen && setViewingPostInModal(null)}
        onEdit={
          !activeArchive?.isOnline && viewingPostInModal
            ? () => handleEditPost(viewingPostInModal)
            : undefined
        }
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
        multiple
      />
    </div>
  );
}
