"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface AdminLoginClientProps {
  profile: any;
}

export default function AdminLoginClient({ profile }: AdminLoginClientProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 bg-background/20 backdrop-blur-md z-10 border-b border-white/20">
        <Link
          href="/"
          className="flex items-center gap-2"
          prefetch={false}>
          {profile?.appIconUrl ? (
            <img
              src={profile.appIconUrl}
              alt="App Icon"
              className="h-auto w-8 rounded object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-primary" />
          )}
          <span className="font-semibold text-black">LinkHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {/* Admin button hidden on login page */}
        </nav>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 lg:p-6">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-black">
              <User className="h-6 w-6" />
              Admin Login
            </CardTitle>
            <CardDescription className="text-black/70">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-black font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/30 backdrop-blur-sm border border-white/40 focus:border-white/60 focus:ring-0 placeholder:text-black/50 text-black"
                  placeholder="Enter your username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-black font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/30 backdrop-blur-sm border border-white/40 focus:border-white/60 focus:ring-0 placeholder:text-black/50 text-black"
                  placeholder="Enter your password"
                />
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-lg p-3">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300 text-black font-medium" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-white/20 bg-white/10 backdrop-blur-md">
        <p className="text-xs text-black text-center sm:text-left">
          <span className="sm:hidden">
            &copy; {new Date().getFullYear()} LinkHub. Built by Michael Martell.<br />
            All rights reserved.
          </span>
          <span className="hidden sm:inline">
            &copy; {new Date().getFullYear()} LinkHub. Built by Michael Martell. All rights reserved.
          </span>
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/terms"
            className="text-xs text-black hover:underline underline-offset-4"
            prefetch={false}>
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-xs text-black hover:underline underline-offset-4"
            prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
} 