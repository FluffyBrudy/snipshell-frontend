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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === "login" ? "Login" : "Register"}
        </h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700 text-sm">
            {typeof error === "string" ? error : "Something went wrong"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) =>
                  setForm({ ...form, displayName: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === "login"
            ? "Don’t have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-indigo-600 hover:underline font-medium"
          >
            {mode === "login" ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
