import Link from "next/link";
import { Button } from "@/components/ui/button";
import PublicProfileClient from "@/components/public-profile-client";
import { User } from "lucide-react";
import { api } from "@/trpc/server";

export default async function Home() {
  const profile = await api.profile.get();

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
					<Button
						asChild
						variant="ghost"
						size="sm"
						className="bg-white/5 text-black/60 hover:text-black hover:bg-white/10">
						<Link href="/admin">Admin</Link>
					</Button>
				</nav>
			</header>
			<main className="flex-1">
				<PublicProfileClient />
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
  )
}
