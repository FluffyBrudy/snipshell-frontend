"use client";
import { TerminalLoginForm } from "@/app/components/auth/terminal-login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <TerminalLoginForm />
    </div>
  );
}
