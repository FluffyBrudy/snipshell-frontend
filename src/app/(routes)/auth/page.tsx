"use client";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-green-500">SnipShell</h1>
        <p className="text-gray-300 text-lg">Choose your authentication method</p>
        <div className="space-y-4">
          <Link 
            href="/auth/login"
            className="block w-64 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/auth/register"
            className="block w-64 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
