"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TerminalWindow } from "@/app/components/terminal/terminal-window";
import { TerminalInput } from "@/app/components/terminal/terminal-input";
import { TerminalText } from "@/app/components/terminal/terminal-text";
import { useAuth } from "@/lib/hooks/useAuth";

export function TerminalLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentStep, setCurrentStep] = useState<
    "email" | "password" | "processing"
  >("email");

  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setCurrentStep("password");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      setCurrentStep("processing");
      const result = await login({ email, password });
      console.log(result);
      if (result.success) {
        router.push("/");
      } else {
        setCurrentStep("email");
        setEmail("");
        setPassword("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setCurrentStep("email");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <TerminalWindow
      title="Authentication System v1.0"
      className="max-w-2xl mx-auto"
    >
      <div className="space-y-4">
        <TerminalText>Welcome to the Command Line Interface</TerminalText>
        <TerminalText>Please authenticate to continue...</TerminalText>
        <div className="h-4"></div>

        {error && <TerminalText color="red">ERROR: {error}</TerminalText>}

        {currentStep === "email" && (
          <form onSubmit={handleEmailSubmit}>
            <TerminalInput
              prompt="email:"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              autoFocus
              onKeyDown={handleKeyDown}
            />
          </form>
        )}

        {currentStep === "password" && (
          <div className="space-y-2">
            <TerminalText>email: {email}</TerminalText>
            <form onSubmit={handlePasswordSubmit}>
              <TerminalInput
                prompt="password:"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoFocus
                onKeyDown={handleKeyDown}
              />
            </form>
            <TerminalText className="text-xs text-green-600">
              Press ESC to go back | Press ENTER to login
            </TerminalText>
          </div>
        )}

        {currentStep === "processing" && (
          <div className="space-y-2">
            <TerminalText>email: {email}</TerminalText>
            <TerminalText>password: {"*".repeat(password.length)}</TerminalText>
            <TerminalText color="yellow">
              {isLoading ? "Authenticating..." : "Processing login..."}
            </TerminalText>
          </div>
        )}

        <div className="pt-8">
          <TerminalText className="text-xs text-green-600">
            Don&apos;t have an account?{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => router.push("/auth/register")}
            >
              Register here
            </span>
          </TerminalText>
        </div>
      </div>
    </TerminalWindow>
  );
}
