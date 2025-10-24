
"use client";

import { ArrowLeft, Edit, X } from "lucide-react";
import type { Post } from "@/lib/types";
import { Button } from "./ui/button";
import { PostContent } from "./post-content";
import { useArchive } from "@/hooks/use-archive";
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

interface PostViewProps {
  post: Post;
  onEdit?: () => void;
  onBack: () => void;
}

export function PostView({ post, onEdit, onBack }: PostViewProps) {
  const { deletePost, activeArchive } = useArchive();

  const handleDelete = () => {
    deletePost(post.id);
    onBack();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="relative max-w-4xl mx-auto">
            <Button variant="ghost" onClick={onBack} className="mb-6 rounded-full pl-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center gap-2">
                 {onEdit && !activeArchive?.isOnline && (
                    <Button variant="outline" size="icon" className="rounded-full" onClick={onEdit}>
                        <Edit className="h-4 w-4"/>
                        <span className="sr-only">Edit Post</span>
                    </Button>
                )}
                {!activeArchive?.isOnline && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full text-red-500 hover:text-red-600">
                                <X className="h-5 w-5"/>
                                <span className="sr-only">Delete Post</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will delete the post titled &quot;{post.title}&quot;. You can undo this action from the notification that will appear.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
          </div>
          <PostContent post={post} />
      </div>
    </div>
  );
}

