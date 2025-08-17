"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TerminalWindow } from "@/app/components/terminal/terminal-window";
import { TerminalInput } from "@/app/components/terminal/terminal-input";
import { TerminalText } from "@/app/components/terminal/terminal-text";
import { useAuth } from "@/lib/hooks/useAuth";

export function TerminalRegisterForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentStep, setCurrentStep] = useState<
    "displayName" | "email" | "password" | "processing"
  >("displayName");
  const { register, isLoading, error } = useAuth();
  const router = useRouter();

  const handleDisplayNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      setCurrentStep("email");
    }
  };

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
      const result = await register({ displayName, email, password });
      if (result.success) {
        router.push("/dashboard");
      } else {
        setCurrentStep("displayName");
        setDisplayName("");
        setEmail("");
        setPassword("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (currentStep === "email") {
        setCurrentStep("displayName");
      } else if (currentStep === "password") {
        setCurrentStep("email");
      } else {
        setCurrentStep("displayName");
        setDisplayName("");
        setEmail("");
        setPassword("");
      }
    }
  };

  return (
    <TerminalWindow
      title="User Registration System v1.0"
      className="max-w-2xl mx-auto"
    >
      <div className="space-y-4">
        <TerminalText>Welcome to the Command Line Interface</TerminalText>
        <TerminalText>Creating new user account...</TerminalText>
        <div className="h-4"></div>

        {error && <TerminalText color="red">ERROR: {error}</TerminalText>}

        {currentStep === "displayName" && (
          <form onSubmit={handleDisplayNameSubmit}>
            <TerminalInput
              prompt="name:"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              autoFocus
              onKeyDown={handleKeyDown}
            />
          </form>
        )}

        {currentStep === "email" && (
          <div className="space-y-2">
            <TerminalText>name: {displayName}</TerminalText>
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
          </div>
        )}

        {currentStep === "password" && (
          <div className="space-y-2">
            <TerminalText>name: {displayName}</TerminalText>
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
              Press ESC to go back | Press ENTER to register
            </TerminalText>
          </div>
        )}

        {currentStep === "processing" && (
          <div className="space-y-2">
            <TerminalText>name: {displayName}</TerminalText>
            <TerminalText>email: {email}</TerminalText>
            <TerminalText>password: {"*".repeat(password.length)}</TerminalText>
            <TerminalText color="yellow">
              {isLoading ? "Creating account..." : "Processing registration..."}
            </TerminalText>
          </div>
        )}

        <div className="pt-8">
          <TerminalText className="text-xs text-green-600">
            Already have an account?{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => router.push("/auth/login")}
            >
              Login here
            </span>
          </TerminalText>
        </div>
      </div>
    </TerminalWindow>
  );
}
