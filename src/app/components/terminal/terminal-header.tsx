"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { Button } from "@/app/components/ui/button";
import { LogOut, Terminal, User } from "lucide-react";

interface TerminalHeaderProps {
  terminalReady: boolean;
}
const bootSequence = [
  "Initializing command storage system...",
  "Loading user preferences...",
  "Connecting to command database...",
  "Terminal ready.",
];

export default function TerminalHeader({ terminalReady }: TerminalHeaderProps) {
  const { user, logout } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bootText, setBootText] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!terminalReady) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < bootSequence.length) {
          setBootText(bootSequence[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [terminalReady]);

  return (
    <div className="border border-border rounded bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Terminal className="w-6 h-6 text-primary terminal-glow" />
          <div>
            <h1 className="text-xl font-bold text-primary terminal-text">
              CommandVault
              <span className="terminal-cursor ml-1">_</span>
            </h1>
            <p className="text-sm text-muted-foreground terminal-text">
              Linux Command Storage System v2.1.0
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-accent terminal-text">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTime.toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground terminal-text">
              {user?.displayName || user?.email || "user"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {!terminalReady && (
        <div className="bg-muted/20 rounded p-3 border-l-2 border-primary">
          <p className="text-sm text-primary terminal-text">
            <span className="text-accent">root@commandvault:~$</span> {bootText}
            <span className="terminal-cursor">_</span>
          </p>
        </div>
      )}
    </div>
  );
}
