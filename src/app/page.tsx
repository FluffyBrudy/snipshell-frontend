"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { useCommandsStore } from "@/app/store/commands.store";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/app/components/ui/sidebar";
import { CommandCard } from "./components/terminal/command-card";
import { SearchBar } from "@/app/components/ui/searchbar";
import {
  Terminal,
  BookOpen,
  Plus,
  ChevronLeft,
  ChevronRight,
  Command,
  History,
  Star,
  Settings,
  Loader2,
} from "lucide-react";
import AuthPage from "@/app/(routes)/auth/page";
import type { UserCommand } from "@/types/entities";
import { CommandForm } from "@/app/components/terminal/command-form";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const {
    userCommands,
    searchResults,
    paginationMeta,
    isLoading,
    isSearching,
    getUserCommands,
    searchUserCommands,
    searchUserCommandsByTags,
    clearSearchResults,
    setCurrentPage,
    deleteUserCommand,
  } = useCommandsStore();

  const [activeView, setActiveView] = useState<"all" | "search" | "favorites">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [tagSearchInput, setTagSearchInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<"text" | "tags">("text");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editing, setEditing] = useState<null | {
    id: number;
    initialValues: {
      command?: string;
      arguments?: string;
      note?: Record<string, string>;
      tags?: string[];
    };
  }>(null);

  useEffect(() => {
    if (isAuthenticated) {
      getUserCommands({ page: 1 });
    }
  }, [isAuthenticated, getUserCommands]);

  useEffect(() => {
    if (searchMode === "text" && searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchUserCommands(searchQuery, true);
        setActiveView("search");
      }, 300);
      return () => clearTimeout(timeoutId);
    } else if (searchMode === "tags" && selectedTags.length > 0) {
      const timeoutId = setTimeout(() => {
        searchUserCommandsByTags(selectedTags, true);
        setActiveView("search");
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      clearSearchResults();
      setActiveView("all");
    }
  }, [
    searchQuery,
    selectedTags,
    searchMode,
    searchUserCommands,
    searchUserCommandsByTags,
    clearSearchResults,
  ]);

  const handlePageChange = (direction: "prev" | "next") => {
    if (!paginationMeta) return;
    const newPage =
      direction === "next" ? paginationMeta.page + 1 : paginationMeta.page - 1;
    if (newPage >= 1 && newPage <= paginationMeta.totalPages) {
      setCurrentPage(newPage);
      getUserCommands({ page: newPage });
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchMode("tags");
    setSelectedTags([tag]);
    setSearchQuery("");
  };

  const handleEdit = (command: UserCommand) => {
    const getArgsTail = (uc: UserCommand) => {
      const base = uc.command?.command || "";
      if (!base) return uc.arguments;
      return uc.arguments.replace(new RegExp("^" + base + "\\s*", "i"), "");
    };

    setEditing({
      id: command.id,
      initialValues: {
        command: command.command?.command || "",
        arguments: getArgsTail(command),
        note: command.note || {},
        tags: command.tags?.map((t) => t.name) || [],
      },
    });
  };

  const clearAllSearch = () => {
    setSearchQuery("");
    setTagSearchInput("");
    setSelectedTags([]);
    clearSearchResults();
    setActiveView("all");
  };

  const displayCommands =
    activeView === "search" ? searchResults : userCommands;
  const hasActiveSearch =
    (searchMode === "text" && searchQuery.trim()) ||
    (searchMode === "tags" && selectedTags.length > 0);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="border-b border-border/50 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg animate-pulse-glow">
                <Terminal className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">SnipShell</h1>
                <p className="text-sm text-muted-foreground">Command Library</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "all"}
                  onClick={() => setActiveView("all")}
                  className="w-full justify-start"
                >
                  <BookOpen className="w-4 h-4" />
                  All Commands
                  <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">
                    {userCommands.length}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {hasActiveSearch && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === "search"}
                    onClick={() => setActiveView("search")}
                    className="w-full justify-start"
                  >
                    <Command className="w-4 h-4" />
                    Search Results
                    <span className="ml-auto text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                      {searchResults.length}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "favorites"}
                  onClick={() => setActiveView("favorites")}
                  className="w-full justify-start opacity-50 cursor-not-allowed"
                >
                  <Star className="w-4 h-4" />
                  Favorites
                  <span className="ml-auto text-xs text-muted-foreground">
                    Soon
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start opacity-50 cursor-not-allowed">
                  <History className="w-4 h-4" />
                  Recent
                  <span className="ml-auto text-xs text-muted-foreground">
                    Soon
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start opacity-50 cursor-not-allowed">
                  <Settings className="w-4 h-4" />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <div className="flex flex-col h-full">
            <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {activeView === "all" && "All Commands"}
                      {activeView === "search" &&
                        `${
                          searchMode === "tags" ? "Tag" : "Text"
                        } Search Results`}
                      {activeView === "favorites" && "Favorite Commands"}
                    </h2>
                    <p className="text-muted-foreground">
                      {activeView === "all" &&
                        "Manage your personal command library"}
                      {activeView === "search" &&
                        `Found ${searchResults.length} matching commands`}
                      {activeView === "favorites" && "Your starred commands"}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover-lift"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Command
                </Button>
              </div>
            </header>

            <main className="flex-1 p-6 space-y-6 custom-scrollbar overflow-auto">
              <Card className="glass-effect border-border/50">
                <CardContent className="p-6">
                  <SearchBar
                    searchMode={searchMode}
                    searchQuery={searchQuery}
                    selectedTags={selectedTags}
                    tagSearchInput={tagSearchInput}
                    onSearchModeChange={setSearchMode}
                    onSearchQueryChange={setSearchQuery}
                    onTagSearchInputChange={setTagSearchInput}
                    onTagAdd={(tag: string) => {
                      if (!selectedTags.includes(tag)) {
                        setSelectedTags([...selectedTags, tag]);
                      }
                      setTagSearchInput("");
                    }}
                    onTagRemove={(tag: string) =>
                      setSelectedTags(selectedTags.filter((t) => t !== tag))
                    }
                    onClearAll={clearAllSearch}
                    isSearching={isSearching}
                  />
                </CardContent>
              </Card>

              {(isLoading || isSearching) && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
                    <div>
                      <h3 className="text-lg font-medium">
                        {isSearching
                          ? "Searching commands..."
                          : "Loading your library..."}
                      </h3>
                      <p className="text-muted-foreground">
                        {isSearching
                          ? "Finding the perfect matches"
                          : "Preparing your commands"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && !isSearching && displayCommands.length === 0 && (
                <div className="text-center py-20">
                  <div className="animate-float mb-6">
                    <BookOpen className="w-20 h-20 text-muted-foreground/50 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {userCommands.length === 0
                      ? "Welcome to SnipShell!"
                      : "No Results Found"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {userCommands.length === 0
                      ? "Start building your personal command library by adding your first command snippet."
                      : searchMode === "tags"
                      ? "Try different tags or switch to text search to find what you're looking for."
                      : "Try adjusting your search terms or switch to tag search for better results."}
                  </p>
                  {userCommands.length === 0 && (
                    <Button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Command
                    </Button>
                  )}
                </div>
              )}

              {!isLoading && !isSearching && displayCommands.length > 0 && (
                <div className="grid gap-4">
                  {displayCommands.map((command, index) => (
                    <CommandCard
                      key={command.id}
                      command={command}
                      onEdit={handleEdit}
                      onDelete={deleteUserCommand}
                      onTagClick={handleTagClick}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {activeView === "all" &&
                paginationMeta &&
                paginationMeta.totalPages > 1 && (
                  <Card className="glass-effect border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Page {paginationMeta.page} of{" "}
                          {paginationMeta.totalPages}
                          <span className="ml-2">
                            ({paginationMeta.total} total commands)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange("prev")}
                            disabled={!paginationMeta.hasPrevPage}
                            className="hover-lift"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange("next")}
                            disabled={!paginationMeta.hasNextPage}
                            className="hover-lift"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
            </main>
          </div>
        </SidebarInset>
      </div>

      {showCreateForm && (
        <CommandForm
          onClose={() => setShowCreateForm(false)}
          isOpen={showCreateForm}
        />
      )}

      {editing && (
        <CommandForm
          onClose={() => setEditing(null)}
          isOpen
          mode="edit"
          userCommandId={editing.id}
          initialValues={editing.initialValues}
        />
      )}
    </SidebarProvider>
  );
}
