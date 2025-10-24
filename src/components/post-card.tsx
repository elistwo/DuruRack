
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import type { ArchiveDisplayOptions, Post, BorderRadius } from "@/lib/types";
import { Card, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClientMarkdownRenderer } from "./client-markdown-renderer";
import Image from "next/image";
import { Button } from "./ui/button";
import { Expand, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useArchive } from "@/hooks/use-archive";

interface PostCardProps {
  post: Post;
  onSelect: () => void;
  onExpand: () => void;
  displayOptions?: ArchiveDisplayOptions;
}

const ClientFormattedDate = ({
  dateString,
  formatString,
}: {
  dateString: string;
  formatString: string;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  try {
    return <>{format(new Date(dateString), formatString)}</>;
  } catch (e) {
    return null;
  }
};

const getBorderRadiusStyle = (radius: BorderRadius | undefined): React.CSSProperties => {
    if (typeof radius === 'number') {
        return { borderRadius: `${radius}px` };
    }
    if (typeof radius === 'object' && radius !== null) {
        const { tl = 0, tr = 0, br = 0, bl = 0 } = radius;
        return { borderRadius: `${tl}px ${tr}px ${br}px ${bl}px` };
    }
    return {};
}

const DefaultCardLayout = ({ post, onSelect, onExpand, displayOptions }: PostCardProps) => {
  const imageStyle = displayOptions?.imageStyle || 'contained';
  const borderRadiusStyle = getBorderRadiusStyle(displayOptions?.borderRadius);
  const { deletePost, activeArchive } = useArchive();

  return (
    <Card
      className={cn("flex flex-col h-full w-full bg-card hover:shadow-xl transition-shadow duration-300 overflow-hidden group")}
      style={borderRadiusStyle}
    >
      <div
        className={cn(
          "flex-1 flex flex-col cursor-pointer",
          imageStyle === 'contained' && 'p-6'
        )}
        onClick={onSelect}
      >
        <div className={cn("relative w-full aspect-[16/10] overflow-hidden bg-muted/30",
          imageStyle === 'contained' && 'mb-4'
        )} style={borderRadiusStyle}>
          {post.previewImageUrl ? (
            <Image
              src={post.previewImageUrl}
              alt={post.title}
              fill
              style={{ objectFit: displayOptions?.imageFit || "cover" }}
              className={cn(displayOptions?.imageFit === "contain" && "p-2")}
            />
          ) : (
            <div className="p-2 text-sm text-muted-foreground line-clamp-6 h-full overflow-hidden">
              <ClientMarkdownRenderer content={post.content.substring(0, 300)} />
            </div>
          )}
        </div>
        <div className={cn(imageStyle === 'full-bleed' && 'p-6')}>
          <CardTitle className="text-xl font-bold font-headline group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
          {post.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.description}</p>}
        </div>
      </div>

      <CardFooter className={cn(
        "flex items-end justify-between gap-4 pt-0 mt-auto",
        imageStyle === 'full-bleed' ? 'p-6' : 'px-6 pb-6'
      )}>
        <div className="flex flex-col items-start gap-3">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs font-medium"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            <ClientFormattedDate
              dateString={post.createdAt}
              formatString="MMMM d, yyyy"
            />
          </p>
        </div>
        <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand();
                }}
              >
                <Expand className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quick View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
         {!activeArchive?.isOnline && (
            <AlertDialog>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-9 w-9 text-red-500 hover:text-red-600"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete Post</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete the post titled &quot;{post.title}&quot;. You can undo this action later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletePost(post.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
        </div>
      </CardFooter>
    </Card>
  );
}

const DefaultOverlayLayout = ({ post, onSelect, onExpand, displayOptions }: PostCardProps) => {
  const borderRadiusStyle = getBorderRadiusStyle(displayOptions?.borderRadius);
    const { deletePost, activeArchive } = useArchive();

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "relative w-full h-full aspect-[16/10] bg-card hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
      )}
      style={borderRadiusStyle}
    >
      {post.previewImageUrl ? (
        <Image
          src={post.previewImageUrl}
          alt={post.title}
          fill
          style={{ objectFit: displayOptions?.imageFit || "cover" }}
        />
      ) : (
        <div className="flex items-center justify-center h-full p-4 text-center text-muted-foreground bg-muted">
          <p>{post.title}</p>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
        <CardTitle className="text-xl font-bold drop-shadow-md line-clamp-2">
          {post.title}
        </CardTitle>
        <p className="text-sm text-white/80 mt-1 drop-shadow-md">
          <ClientFormattedDate dateString={post.createdAt} formatString="MMMM d, yyyy" />
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-medium bg-white/20 text-white border-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 flex items-center">
        <TooltipProvider>
            <Tooltip>
            <TooltipTrigger asChild>
                <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 bg-black/30 hover:bg-black/50 text-white hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    onExpand();
                }}
                >
                <Expand className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Quick View</p>
            </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        {!activeArchive?.isOnline && (
            <AlertDialog>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-9 w-9 bg-black/30 hover:bg-black/50 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete Post</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete the post titled &quot;{post.title}&quot;. You can undo this action later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletePost(post.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
        </div>
    </Card>
  );
};


const PosterClassicLayout = ({ post, onSelect, onExpand, displayOptions }: PostCardProps) => {
    const borderRadiusStyle = getBorderRadiusStyle(displayOptions?.borderRadius);
    const { deletePost, activeArchive } = useArchive();

    return (
        <Card 
            className={cn("flex flex-col h-full w-full bg-card hover:shadow-xl transition-shadow duration-300 overflow-hidden group")}
            onClick={onSelect}
            style={borderRadiusStyle}
        >
            <div className={cn("relative w-full aspect-[10/16] cursor-pointer bg-muted")}>
                 {post.previewImageUrl ? (
                    <Image 
                        src={post.previewImageUrl} 
                        alt={post.title} 
                        fill 
                        style={{ objectFit: displayOptions?.imageFit || "cover" }}
                        className={cn(displayOptions?.imageFit === "contain" && "p-2")}
                    />
                ) : (
                     <div className="flex items-center justify-center h-full p-4 text-center text-muted-foreground">
                        <p>{post.title}</p>
                    </div>
                )}
                 <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end">
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs font-medium bg-white/20 text-white border-0">{tag}</Badge>
                        ))}
                        </div>
                    )}
                </div>
                <div className="absolute top-2 right-2 flex items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-9 w-9 bg-black/30 hover:bg-black/50 text-white hover:text-white"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    onExpand();
                                    }}
                                >
                                    <Expand className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Quick View</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                     {!activeArchive?.isOnline && (
                        <AlertDialog>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-full h-9 w-9 bg-black/30 hover:bg-black/50 text-red-500 hover:text-red-600"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete Post</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will delete the post titled &quot;{post.title}&quot;. You can undo this action later.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deletePost(post.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
            <div className="p-4">
                 <CardTitle className="font-bold font-headline group-hover:text-primary transition-colors line-clamp-2 text-base">
                    {post.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                    <ClientFormattedDate
                        dateString={post.createdAt}
                        formatString="MMMM d, yyyy"
                    />
                </p>
            </div>
        </Card>
    );
}

const PosterOverlayLayout = ({ post, onSelect, onExpand, displayOptions }: PostCardProps) => {
  const borderRadiusStyle = getBorderRadiusStyle(displayOptions?.borderRadius);
    const { deletePost, activeArchive } = useArchive();

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "relative w-full h-full aspect-[10/16] bg-card hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
      )}
      style={borderRadiusStyle}
    >
      {post.previewImageUrl ? (
        <Image
          src={post.previewImageUrl}
          alt={post.title}
          fill
          style={{ objectFit: displayOptions?.imageFit || "cover" }}
        />
      ) : (
        <div className="flex items-center justify-center h-full p-4 text-center text-muted-foreground bg-muted">
          <p>{post.title}</p>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <CardTitle className="text-lg font-bold drop-shadow-md line-clamp-2">
          {post.title}
        </CardTitle>
        <p className="text-xs text-white/80 mt-1 drop-shadow-md">
          <ClientFormattedDate dateString={post.createdAt} formatString="MMMM d, yyyy" />
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-medium bg-white/20 text-white border-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

        <div className="absolute top-2 right-2 flex items-center">
            <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 bg-black/30 hover:bg-black/50 text-white hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        onExpand();
                    }}
                    >
                    <Expand className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Quick View</p>
                </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {!activeArchive?.isOnline && (
                <AlertDialog>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full h-9 w-9 bg-black/30 hover:bg-black/50 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete Post</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will delete the post titled &quot;{post.title}&quot;. You can undo this action later.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deletePost(post.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    </Card>
  );
};


export function PostCard(props: PostCardProps) {
  const { displayOptions } = props;

  switch(displayOptions?.cardStyle) {
    case 'default-overlay':
      return <DefaultOverlayLayout {...props} />;
    case 'poster-classic':
      return <PosterClassicLayout {...props} />;
    case 'poster-overlay':
      return <PosterOverlayLayout {...props} />;
    default:
      return <DefaultCardLayout {...props} />;
  }
}
