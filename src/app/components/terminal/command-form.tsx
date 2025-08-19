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

interface NoteField {
  id: string;
  key: string;
  value: string;
}

export function CommandForm({
  onClose,
  initialCommand = "",
}: CommandFormProps) {
  const [command, setCommand] = useState(initialCommand);
  const [arguments_, setArguments] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [noteFields, setNoteFields] = useState<NoteField[]>([
    { id: "1", key: "description", value: "" }
  ]);

  const { createUserCommand, isLoading } = useCommandsStore();

  // Tag validation regex
  const tagRegex = /^[a-z]+(?:-[a-z0-9]+)*$/;

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
  };

  const getValidTags = (): string[] => {
    return tagsInput
      .split(/\s+/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && tagRegex.test(tag));
  };

  const addNoteField = () => {
    const newId = Date.now().toString();
    setNoteFields([...noteFields, { id: newId, key: "", value: "" }]);
  };

  const removeNoteField = (id: string) => {
    if (noteFields.length > 1) {
      setNoteFields(noteFields.filter(field => field.id !== id));
    }
  };

  const updateNoteField = (id: string, fieldName: 'key' | 'value', value: string) => {
    setNoteFields(noteFields.map(field => 
      field.id === id ? { ...field, [fieldName]: value } : field
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!command.trim()) return;

    const base = command.trim();
    const rawArgs = arguments_.trim();
    const prefixRegex = new RegExp("^" + base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*", "i");
    const normalizedArgs = rawArgs.replace(prefixRegex, "").trim();

    // Convert note fields to Record<string, string>
    const note: Record<string, string> = {};
    noteFields.forEach(field => {
      if (field.key.trim() && field.value.trim()) {
        note[field.key.trim()] = field.value.trim();
      }
    });

    const commandData: CreateUsercommandRequest = {
      command: base,
      arguments: normalizedArgs,
      note,
      tags: getValidTags(),
    };

    try {
      await createUserCommand(commandData);
      onClose();
    } catch (error) {
      console.error("Failed to create command:", error);
    }
  };

  const validTags = getValidTags();
  const invalidTags = tagsInput
    .split(/\s+/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0 && !tagRegex.test(tag));

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
              <Label className="text-terminal-cyan font-mono">Notes</Label>
              <div className="space-y-3">
                {noteFields.map((field) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      value={field.key}
                      onChange={(e) => updateNoteField(field.id, 'key', e.target.value)}
                      placeholder="Key"
                      className="bg-terminal-darker border-terminal-green/30 text-terminal-green font-mono focus:border-terminal-cyan"
                    />
                    <Input
                      value={field.value}
                      onChange={(e) => updateNoteField(field.id, 'value', e.target.value)}
                      placeholder="Value"
                      className="bg-terminal-darker border-terminal-green/30 text-terminal-green font-mono focus:border-terminal-cyan"
                    />
                    {noteFields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeNoteField(field.id)}
                        variant="outline"
                        size="sm"
                        className="border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 bg-transparent"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addNoteField}
                  variant="outline"
                  size="sm"
                  className="border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note Field
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-terminal-cyan font-mono">Tags</Label>
              <Input
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="git version-control (space separated, lowercase with hyphens)"
                className="bg-terminal-darker border-terminal-green/30 text-terminal-green font-mono focus:border-terminal-cyan"
              />
              {validTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {validTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-terminal-green/10 border-terminal-green/30 text-terminal-green font-mono"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {invalidTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {invalidTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-red-500/10 border-red-500/30 text-red-400 font-mono"
                    >
                      {tag} (invalid)
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-terminal-green/60">
                Tags must be lowercase letters, can include hyphens and numbers after hyphens
              </p>
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
