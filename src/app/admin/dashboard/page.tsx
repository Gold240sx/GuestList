"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardClient from "@/components/dashboard-client";
import { Home, User, LogOut } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { data: profile } = api.profile.get.useQuery();

  useEffect(() => {
    // Check if admin is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/verify");
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-muted/40">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b border-white/20 bg-white/10 backdrop-blur-md px-4 md:px-6 z-50 shadow-lg">
          <Skeleton className="h-6 w-32" />
          <div className="ml-auto">
            <Skeleton className="h-10 w-20" />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-muted/40">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b border-white/20 bg-white/10 backdrop-blur-md px-4 md:px-6 z-50 shadow-lg">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base text-black hover:text-black/80 transition-colors"
          >
            {profile?.appIconUrl ? (
              <img 
                src={profile.appIconUrl} 
                alt="App Icon" 
                className="h-8 w-8 rounded object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-primary" />
            )}
            <span className="font-bold">LinkHub Admin</span>
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
            <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/20 transition-all duration-300">
              {profile?.appIconUrl ? (
                <img 
                  src={profile.appIconUrl} 
                  alt="App Icon" 
                  className="h-6 w-6 rounded object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-black" />
              )}
              <span className="sr-only">View Public Page</span>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={profile?.profilePictureUrl} 
                    alt="Admin Avatar" 
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
              <DropdownMenuLabel className="text-black">Admin</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem onClick={handleLogout} className="text-black hover:bg-white/20 focus:bg-white/20">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in">
        <DashboardClient />
      </main>
    </div>
  );
} 