import Link from "next/link";
import { Button } from "@/components/ui/button";
import PublicProfileClient from "@/components/public-profile-client";
import { User } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <User className="h-6 w-6 text-primary" />
          <span className="sr-only">Profile</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="outline">
            <Link href="/dashboard">Admin Dashboard</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <PublicProfileClient />
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 LinkHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
