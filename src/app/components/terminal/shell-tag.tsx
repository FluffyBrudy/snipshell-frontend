import React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface Tag {
  id: number;
  name: string;
}

interface TagListProps {
  tags: Tag[];
  onTagClick: (name: string) => void;
}

export function TagList({ tags, onTagClick }: TagListProps) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          onClick={() => onTagClick(tag.name)}
          className={cn(
            "terminal-tag inline-flex items-center gap-2 px-2 py-1 text-sm",
            "cursor-pointer transition-colors",
            "w-fit"
          )}
        >
          <span className="font-mono text-xs">#{tag.name}</span>
        </Badge>
      ))}
    </div>
  );
}
