"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Import, FilePlus, Link, MessageSquareText } from "lucide-react";

interface WelcomeScreenProps {
  onImportClick: () => void;
  onNewPostClick: () => void;
  onImportFromUrl: (url: string) => void;
}

export function WelcomeScreen({ onImportClick, onNewPostClick, onImportFromUrl }: WelcomeScreenProps) {
  const [url, setUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleImportFromUrl = () => {
    if (url.trim()) {
      onImportFromUrl(url.trim());
      setUrl("");
      setShowUrlInput(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <div className="max-w-lg w-full">
        <div className="flex flex-col items-center text-center p-8 bg-card rounded-2xl shadow-lg">
          <div className="p-4 bg-primary/10 rounded-full mb-6">
            <div className="p-3 bg-primary/20 rounded-full">
              <MessageSquareText className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-headline text-foreground">Welcome to DuruRack</h1>
          <p className="text-lg text-muted-foreground mt-3 mb-8 max-w-md">
            Your decentralized space to create, share, and own your content.
          </p>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button size="lg" onClick={onImportClick} variant="outline" className="w-full rounded-full">
                <Import className="mr-2 h-5 w-5" />
                Import Archive
              </Button>
              <Button size="lg" onClick={onNewPostClick} className="w-full rounded-full">
                <FilePlus className="mr-2 h-5 w-5" />
                Create First Post
              </Button>
            </div>
            
            {showUrlInput ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Input
                  type="url"
                  placeholder="Enter archive URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleImportFromUrl()}
                  className="w-full rounded-full"
                />
                <Button size="lg" onClick={handleImportFromUrl} className="w-full sm:w-auto rounded-full">
                  <Link className="mr-2 h-5 w-5" />
                  Import
                </Button>
              </div>
            ) : (
              <Button 
                size="lg" 
                onClick={() => setShowUrlInput(true)} 
                variant="outline" 
                className="w-full rounded-full"
              >
                <Link className="mr-2 h-5 w-5" />
                Import from URL
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
