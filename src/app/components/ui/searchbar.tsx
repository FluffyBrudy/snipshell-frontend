"use client";

import type * as React from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Search, Tag, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  searchMode: "text" | "tags";
  searchQuery: string;
  selectedTags: string[];
  tagSearchInput: string;
  onSearchModeChange: (mode: "text" | "tags") => void;
  onSearchQueryChange: (query: string) => void;
  onTagSearchInputChange: (input: string) => void;
  onTagAdd: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  onClearAll: () => void;
  isSearching: boolean;
}

export function SearchBar({
  searchMode,
  searchQuery,
  selectedTags,
  tagSearchInput,
  onSearchModeChange,
  onSearchQueryChange,
  onTagSearchInputChange,
  onTagAdd,
  onTagRemove,
  onClearAll,
  isSearching,
}: SearchBarProps) {
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagSearchInput.trim()) {
      onTagAdd(tagSearchInput.trim());
    }
  };

  const hasActiveSearch =
    (searchMode === "text" && searchQuery.trim()) ||
    (searchMode === "tags" && selectedTags.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg">
          <Button
            size="sm"
            variant={searchMode === "text" ? "default" : "ghost"}
            onClick={() => onSearchModeChange("text")}
            className={cn(
              "h-8 px-3 transition-all",
              searchMode === "text"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted"
            )}
          >
            <Search className="w-4 h-4 mr-2" />
            Text Search
          </Button>
          <Button
            size="sm"
            variant={searchMode === "tags" ? "default" : "ghost"}
            onClick={() => onSearchModeChange("tags")}
            className={cn(
              "h-8 px-3 transition-all",
              searchMode === "tags"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "hover:bg-muted"
            )}
          >
            <Tag className="w-4 h-4 mr-2" />
            Tag Search
          </Button>
        </div>

        {hasActiveSearch && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground animate-fade-in"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}

        {isSearching && (
          <div className="flex items-center gap-2 text-muted-foreground animate-fade-in">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Searching...</span>
          </div>
        )}
      </div>

      {searchMode === "text" ? (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search commands, arguments, or descriptions..."
            className={cn(
              "pl-10 h-12 bg-background/50 border-border/50 focus:border-primary",
              "focus:ring-primary/20 transition-all"
            )}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={tagSearchInput}
              onChange={(e) => onTagSearchInputChange(e.target.value)}
              onKeyDown={handleTagInput}
              placeholder="Type tags and press Enter (e.g., git, docker, linux)..."
              className={cn(
                "pl-10 h-12 bg-background/50 border-border/50 focus:border-accent",
                "focus:ring-accent/20 transition-all"
              )}
            />
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-scale-in">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-accent/10 text-accent border-accent/20 pr-1 hover:bg-accent/20 transition-colors"
                >
                  {tag}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onTagRemove(tag)}
                    className="ml-1 h-4 w-4 p-0 hover:bg-accent/30 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
