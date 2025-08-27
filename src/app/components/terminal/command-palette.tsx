"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useCommandsStore } from "@/app/store/commands.store";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Search, Zap, Play } from "lucide-react";
import type { Command } from "@/types/entities";

export default function CommandPalette() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Command[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { searchSystemCommands, isLoading } = useCommandsStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await searchSystemCommands(searchQuery);
        if (response && response.commands) {
          setSearchResults(response.commands);
          setShowResults(true);
        } else {
          setSearchResults([]);
          setShowResults(false);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    },
    [searchSystemCommands]
  );

  const handleUseCommand = (command: Command) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(command.command);

      console.log(`Command "${command.command}" copied to clipboard`);
    }
    setShowResults(false);
    setQuery("");
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, handleSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary terminal-text">
            Command Palette
          </h2>
          <div className="flex-1" />
          <div className="text-xs text-muted-foreground terminal-text">
            Press{" "}
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+K</kbd>{" "}
            to focus
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search system commands... (e.g., 'find files', 'network status')"
            className="pl-10 bg-input border-border text-foreground terminal-text"
          />
          {(isSearching || isLoading) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2 terminal-text">
              Found {searchResults.length} command(s)
            </div>
            {searchResults.map((command, index) => (
              <div
                key={index}
                className="command-highlight p-3 rounded cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <code className="text-primary terminal-text font-mono text-sm">
                    {command.command}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleUseCommand(command)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Use
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
