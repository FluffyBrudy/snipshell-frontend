"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import TerminalHeader from "@/app/components/terminal/terminal-header";
import CommandPalette from "@/app/components/terminal/command-palette";
import CommandList from "@/app/components/terminal/command-list";
import UserCommandsPanel from "@/app/components/terminal/user-commands-panel";
import AuthPage from "@/app/(routes)/auth/page";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"search" | "saved">("search");
  const [terminalReady, setTerminalReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTerminalReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-terminal-dark text-terminal-green terminal-scan">
      <div className="container mx-auto p-4 max-w-6xl">
        <TerminalHeader terminalReady={terminalReady} />

        <div className="mt-8 space-y-6">
          <CommandPalette />

          <div className="flex space-x-1 border-b border-terminal-green/30">
            <button
              onClick={() => setActiveTab("search")}
              className={`px-4 py-2 text-sm font-medium transition-colors terminal-text font-mono ${
                activeTab === "search"
                  ? "text-terminal-green border-b-2 border-terminal-green"
                  : "text-terminal-green/60 hover:text-terminal-green"
              }`}
            >
              <span className="mr-2">$</span>
              System Commands
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-2 text-sm font-medium transition-colors terminal-text font-mono ${
                activeTab === "saved"
                  ? "text-terminal-cyan border-b-2 border-terminal-cyan"
                  : "text-terminal-green/60 hover:text-terminal-green"
              }`}
            >
              <span className="mr-2">~</span>
              My Commands
            </button>
          </div>

          <div className="min-h-[400px]">
            {activeTab === "search" ? <CommandList /> : <UserCommandsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
