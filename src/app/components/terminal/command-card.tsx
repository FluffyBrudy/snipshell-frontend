"use client";
import { useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import {
  Tag,
  Calendar,
  Copy,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Terminal,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserCommand } from "@/types/entities";

interface CommandCardProps {
  command: UserCommand;
  onEdit: (command: UserCommand) => void;
  onDelete: (id: number) => void;
  onTagClick: (tag: string) => void;
  onToggleFavorite: (id: number) => void;
  index: number;
}

export function CommandCard({
  command,
  onEdit,
  onDelete,
  onTagClick,
  onToggleFavorite,
  index,
}: CommandCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getArgsTail = (uc: UserCommand) => {
    const base = uc.command?.command || "";
    if (!base) return uc.arguments;
    return uc.arguments.replace(new RegExp("^" + base + "\\s*", "i"), "");
  };

  const fullCommand = `${command.command?.command || ""} ${getArgsTail(
    command
  )}`.trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCommand);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const hasNote = Object.keys(command.note).length > 0;

  return (
    <Card
      className={cn(
        "command-card hover-lift group bg-card/50 backdrop-blur-sm border-border/50",
        "hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Terminal className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <code
                    className={cn(
                      "text-sm font-mono bg-muted/50 px-3 py-2 rounded-lg border",
                      "group-hover:bg-muted/70 transition-colors break-all"
                    )}
                  >
                    $ {fullCommand}
                  </code>
                </div>
              </div>

              {command.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex flex-wrap gap-2">
                    {command.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className={cn(
                          "cursor-pointer hover:bg-accent hover:text-accent-foreground",
                          "transition-colors text-xs"
                        )}
                        onClick={() => onTagClick(tag.name)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {hasNote && (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  >
                    <span className="text-sm font-medium">Description</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </Button>

                  {isExpanded && (
                    <div
                      className={cn(
                        "text-sm bg-muted/30 p-3 rounded-lg border animate-scale-in",
                        "space-y-2"
                      )}
                    >
                      {Object.entries(command.note).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex flex-col sm:flex-row sm:items-start gap-1"
                        >
                          <span className="font-medium text-accent min-w-fit">
                            {key}:
                          </span>
                          <span className="text-muted-foreground break-words">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleFavorite(command.id)}
                className={cn(
                  "h-8 w-8 p-0 hover:bg-yellow-500/20 opacity-100",
                  command.isFavourite
                    ? "text-yellow-500 opacity-100"
                    : "text-muted-foreground opacity-100"
                )}
              >
                <Star
                  className={cn(
                    "w-4 h-4",
                    command.isFavourite && "fill-current"
                  )}
                />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className={cn(
                  "h-8 w-8 p-0 hover:bg-accent/20",
                  isCopied && "text-green-600"
                )}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(command)}
                className="h-8 w-8 p-0 hover:bg-accent/20"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(command.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator className="opacity-50" />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(command.createdAt).toLocaleDateString()}</span>
            </div>
            {isCopied && (
              <span className="text-green-600 text-xs animate-fade-in">
                Copied!
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
