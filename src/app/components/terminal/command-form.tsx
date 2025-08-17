"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { useCommandsStore } from "@/app/store/commands.store";
import { X, Plus, Terminal, Save, Loader2 } from "lucide-react";
import type { CreateUsercommandRequest } from "@/types/request.types";

interface CommandFormProps {
  onClose: () => void;
  initialCommand?: string;
}

export function CommandForm({
  onClose,
  initialCommand = "",
}: CommandFormProps) {
  const [command, setCommand] = useState(initialCommand);
  const [arguments_, setArguments] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  const { createUserCommand, isLoading } = useCommandsStore();

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!command.trim()) return;

    const commandData: CreateUsercommandRequest = {
      command: command.trim(),
      arguments: arguments_.trim(),
      note: { description: note.trim() },
      tags,
    };

    try {
      await createUserCommand(commandData);
      onClose();
    } catch (error) {
      console.error("Failed to create command:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-terminal-dark border-terminal-green/30 shadow-2xl shadow-terminal-green/10">
        <CardHeader className="border-b border-terminal-green/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-terminal-green" />
              <CardTitle className="text-terminal-green font-mono">
                $ add-command
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-terminal-green hover:bg-terminal-green/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="command" className="text-terminal-cyan font-mono">
                Command *
              </Label>
              <Input
                id="command"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="git"
                className="bg-terminal-darker border-terminal-green/30 text-terminal-green font-mono focus:border-terminal-cyan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="arguments"
                className="text-terminal-cyan font-mono"
              >
                Arguments
              </Label>
              <Input
                id="arguments"
                value={arguments_}
                onChange={(e) => setArguments(e.target.value)}
                placeholder="commit -m 'message'"
                className="bg-terminal-darker border-terminal-green/30 text-terminal-green font-mono focus:border-terminal-cyan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-terminal-cyan font-mono">
                Description
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What does this command do?"
                className="bg-terminal-darker border-terminal-green/30 text-terminal-green font-mono focus:border-terminal-cyan min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-terminal-cyan font-mono">Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyUp={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="Add a tag..."
                  className="bg-terminal-darker border-terminal-green/30 text-terminal-green font-mono focus:border-terminal-cyan"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  size="sm"
                  className="border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-terminal-green/10 border-terminal-green/30 text-terminal-green font-mono"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!command.trim() || isLoading}
                className="bg-terminal-green text-terminal-dark hover:bg-terminal-green/90 font-mono"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Command
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
