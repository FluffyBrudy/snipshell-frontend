"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { useCommandsStore } from "@/app/store/commands.store";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { 
  Search, 
  Command, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Tag,
  Calendar,
  Sparkles,
  Terminal,
  Loader2
} from "lucide-react";
import AuthPage from "@/app/(routes)/auth/page";
import { UserCommand } from "@/types/entities";
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
    clearSearchResults,
    setCurrentPage,
    deleteUserCommand,
  } = useCommandsStore();
  
  const [activeTab, setActiveTab] = useState<"all" | "search">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [terminalReady, setTerminalReady] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editing, setEditing] = useState<null | {
    id: number;
    initialValues: { command?: string; arguments?: string; note?: Record<string, string>; tags?: string[] };
  }>(null);

  useEffect(() => {
    const timer = setTimeout(() => setTerminalReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getUserCommands({ page: 1 });
    }
  }, [isAuthenticated, getUserCommands]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchUserCommands(searchQuery, true);
        setActiveTab("search");
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      clearSearchResults();
      setActiveTab("all");
    }
  }, [searchQuery, searchUserCommands, clearSearchResults]);

  const handlePageChange = (direction: "prev" | "next") => {
    if (!paginationMeta) return;
    
    const newPage = direction === "next" 
      ? paginationMeta.page + 1 
      : paginationMeta.page - 1;
    
    if (newPage >= 1 && newPage <= paginationMeta.totalPages) {
      setCurrentPage(newPage);
      getUserCommands({ page: newPage });
    }
  };

  const getArgsTail = (uc: UserCommand) => {
    const base = uc.command?.command || "";
    if (!base) return uc.arguments;
    return uc.arguments.replace(new RegExp("^" + base + "\\s*", "i"), "");
  };

  const displayCommands = activeTab === "search" ? searchResults : userCommands;

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="animate-fade-in">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Terminal className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-3xl font-bold text-gradient">
                SnipShell
              </span>
              {terminalReady && (
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              )}
            </div>
            <p className="text-slate-400 text-lg animate-slide-up">
              Your personal command library and terminal companion
            </p>
          </div>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  My Commands
                </CardTitle>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Command
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your commands, arguments, or tags..."
                  className="pl-10 bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center gap-4">
                <Badge 
                  variant={activeTab === "all" ? "default" : "secondary"}
                  className={`cursor-pointer transition-all ${
                    activeTab === "all" 
                      ? "bg-emerald-600 text-white" 
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All Commands ({userCommands.length})
                </Badge>
                {searchQuery && (
                  <Badge 
                    variant={activeTab === "search" ? "default" : "secondary"}
                    className={`cursor-pointer transition-all ${
                      activeTab === "search" 
                        ? "bg-blue-600 text-white" 
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                    onClick={() => setActiveTab("search")}
                  >
                    Search Results ({searchResults.length})
                  </Badge>
                )}
              </div>

              {(isLoading || isSearching) && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-4" />
                    <p className="text-slate-400">
                      {isSearching ? "Searching..." : "Loading your commands..."}
                    </p>
                  </div>
                </div>
              )}

              {!isLoading && !isSearching && displayCommands.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">
                    {userCommands.length === 0 ? "No Commands Yet" : "No Results Found"}
                  </h3>
                  <p className="text-slate-400">
                    {userCommands.length === 0
                      ? "Start by adding your first command"
                      : "Try adjusting your search terms"}
                  </p>
                </div>
              )}

              {!isLoading && !isSearching && displayCommands.length > 0 && (
                <div className="space-y-4">
                                  {displayCommands.map((command, index) => (
                  <div key={command.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <Card className="bg-slate-700/30 border-slate-600 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <Command className="w-4 h-4 text-emerald-400" />
                                  </div>
                                  <code className="text-lg font-mono text-emerald-300 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-600">
                                    $ {command.command?.command || ""} {getArgsTail(command)}
                                  </code>
                                </div>
                                
                                {command.tags.length > 0 && (
                                  <div className="flex items-center gap-2 mb-3">
                                    <Tag className="w-4 h-4 text-slate-400" />
                                    <div className="flex flex-wrap gap-2">
                                      {command.tags.map((tag) => (
                                        <Badge
                                          key={tag.id}
                                          variant="secondary"
                                          className="bg-slate-600/50 text-slate-300 border-slate-500"
                                        >
                                          {tag.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {Object.keys(command.note).length > 0 && (
                                  <div className="text-sm text-slate-300 bg-slate-800/30 p-3 rounded-lg border border-slate-600">
                                    {Object.entries(command.note).map(([key, value]) => (
                                      <div key={key} className="mb-1">
                                        <span className="font-medium text-emerald-400">{key}:</span> {value}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <Separator className="bg-slate-600" />

                            <div className="flex items-center justify-between text-sm text-slate-400">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(command.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-slate-300 hover:text-emerald-400 hover:bg-slate-600/50"
                                  onClick={() => {
                                    setEditing({
                                      id: command.id,
                                      initialValues: {
                                        command: command.command?.command || "",
                                        arguments: getArgsTail(command),
                                        note: command.note || {},
                                        tags: command.tags?.map(t => t.name) || [],
                                      },
                                    });
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  onClick={async () => {
                                    await deleteUserCommand(command.id);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "all" && paginationMeta && paginationMeta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-600">
                  <div className="text-sm text-slate-400">
                    Page {paginationMeta.page} of {paginationMeta.totalPages} 
                    ({paginationMeta.total} total commands)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange("prev")}
                      disabled={!paginationMeta.hasPrevPage}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange("next")}
                      disabled={!paginationMeta.hasNextPage}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
    </div>
  );
}
