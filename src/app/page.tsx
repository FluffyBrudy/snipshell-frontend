import { TerminalWindow } from "@/app/components/terminal/terminal-window";
import { TerminalText } from "@/app/components/terminal/terminal-text";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <TerminalWindow
        title="Command Line Interface System"
        className="max-w-3xl"
      >
        <div className="space-y-4">
          <TerminalText>
            ╔══════════════════════════════════════════════════════════════╗
          </TerminalText>
          <TerminalText>║ CLI MANAGEMENT SYSTEM ║</TerminalText>
          <TerminalText>
            ╚══════════════════════════════════════════════════════════════╝
          </TerminalText>

          <div className="py-4">
            <TerminalText>System Status: ONLINE</TerminalText>
            <TerminalText>Version: 1.0.0</TerminalText>
            <TerminalText>API Endpoint: localhost:3001</TerminalText>
          </div>

          <TerminalText color="yellow">Available Commands:</TerminalText>
          <div className="pl-4 space-y-2">
            <TerminalText>
              <Link href="/auth/login" className="hover:underline">
                $ login - Authenticate user session
              </Link>
            </TerminalText>
            <TerminalText>
              <Link href="/auth/register" className="hover:underline">
                $ register - Create new user account
              </Link>
            </TerminalText>
            <TerminalText className="text-green-600">
              $ help - Display available commands
            </TerminalText>
            <TerminalText className="text-green-600">
              $ status - Check system status
            </TerminalText>
          </div>

          <div className="pt-8">
            <TerminalText className="text-xs text-green-600">
              Welcome to the CLI Management System. Please authenticate to
              access advanced features.
            </TerminalText>
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
}
