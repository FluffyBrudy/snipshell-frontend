"use client";
import { useCommandsStore } from "@/app/store/commands.store";
import { Button } from "@/app/components/ui/button";
import { Plus, Terminal, Search, Check, Copy } from "lucide-react";
import { CommandForm } from "./command-form";
import { useState } from "react";

export default function CommandList() {
  const { systemCommands, isLoading, error } = useCommandsStore();
  const [showCommandForm, setShowCommandForm] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState("");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      console.error("Failed to copy command:", err);
    }
  };

  const handleSaveCommand = (command: string) => {
    setSelectedCommand(command);
    setShowCommandForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-terminal-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-terminal-green terminal-text">
            Searching commands...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
        <p className="text-red-400 terminal-text">{error}</p>
      </div>
    );
  }

  if (systemCommands.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-12 h-12 text-terminal-green/60 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-terminal-green mb-2 terminal-text">
          Start Searching
        </h3>
        <p className="text-terminal-green/70 terminal-text">
          Use the command palette above to search for Linux commands
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-terminal-green terminal-text">
            <Terminal className="w-5 h-5 inline mr-2" />
            System Commands
          </h3>
          <div className="text-sm text-terminal-green/70 terminal-text">
            {systemCommands.length} result(s)
          </div>
        </div>

        <div className="grid gap-3">
          {systemCommands.map((command, index) => (
            <div
              key={index}
              className="command-highlight bg-terminal-darker border border-terminal-green/30 rounded-lg p-4 group hover:border-terminal-cyan/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <code className="text-terminal-green terminal-text font-mono text-sm block mb-2">
                    $ {command.command}
                  </code>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(command.command)}
                    className="border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 bg-transparent"
                  >
                    {copiedCommand === command.command ? (
                      <Check className="w-3 h-3 mr-1" />
                    ) : (
                      <Copy className="w-3 h-3 mr-1" />
                    )}
                    {copiedCommand === command.command ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSaveCommand(command.command)}
                    className="border-terminal-cyan/30 text-terminal-cyan hover:bg-terminal-cyan/10 bg-transparent"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCommandForm && (
        <CommandForm
          onClose={() => setShowCommandForm(false)}
          initialCommand={selectedCommand}
        />
      )}
    </>
  );
}
