"use client";

import { useEffect, useState } from "react";
import { useCommandsStore } from "@/app/store/commands.store";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Plus, Search, BookOpen, Tag, Calendar, Command } from "lucide-react";
import type { UserCommand } from "@/types/entities";
import { CommandForm } from "./command-form";

interface Props {
  hideSearch?: boolean;
}

export default function UserCommandsPanel({ hideSearch = false }: Props) {
  const { userCommands, getUserCommands, getUserCommandsByCommand, isLoading, currentPage } = useCommandsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCommands, setFilteredCommands] = useState<UserCommand[]>([]);
  const [searchMode, setSearchMode] = useState<"all" | "byCommand" | "byArgs">("all");
  const [selectedCommand, setSelectedCommand] = useState<{ id: number; name: string } | null>(null);
  const [commandSearchQuery, setCommandSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const getArgsTail = (uc: UserCommand) => {
    const base = uc.command?.command || "";
    if (!base) return uc.arguments;
    return uc.arguments.replace(new RegExp("^" + escapeRegExp(base) + "\\s*", "i"), "");
  };

  useEffect(() => {
    getUserCommands({ page: 1 });
  }, [getUserCommands]);

  useEffect(() => {
    if (!userCommands) return;

    if (hideSearch) {
      setFilteredCommands(userCommands);
      return;
    }
    
    if (searchQuery.trim()) {
      if (searchMode === "byCommand") {
        const filtered = userCommands.filter(
          (cmd) => (cmd.command?.command || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCommands(filtered);
      } else if (searchMode === "byArgs") {
        const filtered = userCommands.filter(
          (cmd) => getArgsTail(cmd).toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCommands(filtered);
      } else {
        const filtered = userCommands.filter(
          (cmd) =>
            (cmd.command?.command || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            getArgsTail(cmd).toLowerCase().includes(searchQuery.toLowerCase()) ||
            cmd.tags.some((tag) =>
              tag.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        setFilteredCommands(filtered);
      }
    } else {
      setFilteredCommands(userCommands);
    }
  }, [searchQuery, userCommands, searchMode, hideSearch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground terminal-text">
            Loading your commands...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary terminal-text">
          <BookOpen className="w-5 h-5 inline mr-2" />
          My Commands
        </h3>
        <Button 
          onClick={() => setShowCreate(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Command
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your commands or tags..."
          className="pl-10 bg-input border-border text-foreground terminal-text"
        />
      </div>

      {filteredCommands.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2 terminal-text">
            {userCommands.length === 0 ? "No Commands Yet" : "No Results Found"}
          </h3>
          <p className="text-muted-foreground terminal-text">
            {userCommands.length === 0
              ? "Start by saving commands from the system search"
              : "Try adjusting your search terms"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCommands.map((command) => (
            <div
              key={command.id}
              className="command-highlight bg-card border border-border rounded-lg p-4"
            >
              <div className="space-y-3">
                <div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Command className="w-4 h-4 text-primary" />
                  </div>
                  <code className="text-lg font-mono text-primary terminal-text bg-primary/5 px-3 py-1 rounded-lg">
                    $ {(command.command?.command || "")} {getArgsTail(command)}
                  </code>
                  {command.command?.command && (
                    <span className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded border border-muted/30">
                      cmd: {command.command.command}
                    </span>
                  )}
                </div>

                {command.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {command.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="text-xs bg-accent/20 text-accent border-accent/30"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(command.note).length > 0 && (
                  <div className="text-sm text-muted-foreground terminal-text">
                    {Object.entries(command.note).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {value}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(command.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-xs">
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CommandForm
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
