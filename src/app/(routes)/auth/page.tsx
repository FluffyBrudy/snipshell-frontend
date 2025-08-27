"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  const { login, register, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
    } catch {}
  };

  return (
    <div className="matrix-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md command-card rounded-xl overflow-hidden terminal-boot">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <div className="ml-2 text-sm text-muted-foreground">
            auth.tsx — snipshell
          </div>
        </div>

        <div className="p-6">
          <h1 className="mb-4 text-xl font-bold terminal-text glow-text">
            {mode === "login" ? "Login" : "Register"}
            <span className="terminal-cursor" />
          </h1>

          {error && (
            <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-destructive text-sm">
              {typeof error === "string" ? error : "Something went wrong"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) =>
                    setForm({ ...form, displayName: e.target.value })
                  }
                  className="terminal-input w-full rounded-md px-3 py-2 text-sm"
                  placeholder="Neo"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="terminal-input w-full rounded-md px-3 py-2 text-sm"
                placeholder="neo@matrix.io"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="terminal-input w-full rounded-md px-3 py-2 text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="terminal-button w-full rounded-md py-2 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="terminal-spinner" aria-hidden="true" />
                  <span>Please wait...</span>
                </span>
              ) : mode === "login" ? (
                "Login"
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <span className="terminal-prompt">
              {mode === "login"
                ? "Don’t have an account?"
                : "Already have an account?"}
            </span>{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-primary hover:underline font-medium"
            >
              {mode === "login" ? "Register here" : "Login here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
