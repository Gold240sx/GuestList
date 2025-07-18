"use client";

import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GuestListForm from "@/components/guest-list-form";
import SignInModal from "@/components/sign-in-modal";
import { Github, Linkedin, Coffee, FileText, User, Briefcase, Link2 } from "lucide-react";
import type { Guest, ProfileData } from "@/lib/types";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Skeleton } from "./ui/skeleton";

const getDisplayName = (guest: Guest) => {
    if (guest.displayNamePref === 'anonymous') return 'Anonymous';
    if (guest.displayNamePref === 'initial') {
        const parts = guest.name.split(' ');
        const firstName = parts[0] || '';
        const lastInitial = parts.length > 1 ? ` ${parts[parts.length - 1]?.charAt(0) || ''}.` : '';
        return `${firstName}${lastInitial}`;
    }
    return guest.name;
}

const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

const avatarGradients = [
  'from-pink-500 to-yellow-500',
  'from-green-400 to-blue-500',
  'from-purple-500 to-indigo-500',
  'from-red-500 to-orange-500',
  'from-teal-400 to-cyan-500',
]

export default function PublicProfileClient() {
  const guestListSectionRef = useRef<HTMLDivElement>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  
  const { data: guests = [], isLoading: guestsLoading } = api.guest.getAll.useQuery({ includeHidden: false });
  const { data: profile, isLoading: profileLoading } = api.profile.get.useQuery();
  const { data: currentResume = null, isLoading: resumeLoading } = api.resume.getCurrent.useQuery();

  const handleNewGuest = (newGuest: Guest) => {
    // The guest list will be automatically updated via tRPC cache invalidation
  };
  
  const handleResumeClick = () => {
    if (currentResume?.fileUrl) {
      // Open the UploadThing URL directly for download
      window.open(currentResume.fileUrl, '_blank');
    }
  }

  const isLoading = guestsLoading || profileLoading || resumeLoading;

  if (isLoading) {
    return (
        <div className="container max-w-2xl mx-auto px-4 py-8 md:py-12">
            <section className="flex flex-col items-center text-center">
                <Skeleton className="w-48 h-48 rounded-full mb-4" />
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-80" />
            </section>
            <section className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full sm:col-span-2" />
                </div>
            </section>
            <section className="mt-12">
                <Skeleton className="h-96 w-full" />
            </section>
             <section className="mt-12">
                <Skeleton className="h-96 w-full" />
            </section>
        </div>
    )
  }

  if (!profile) {
      return (
          <div className="container max-w-2xl mx-auto px-4 py-8 md:py-12 text-center">
              <p>Profile data not found. Please set up your profile in the admin dashboard.</p>
          </div>
      )
  }

  return (
		<>
			<div className="container max-w-2xl mx-auto px-4 py-8  md:py-16">
				<section className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
					<div className="w-48 h-48 relative mb-4">
						<Image
							src={profile.profilePictureUrl}
							alt="Profile Picture"
							width={400}
							height={400}
							data-ai-hint="profile picture"
							className="rounded-full object-cover border-4 border-card"
							priority
						/>
					</div>
					<h1 className="text-3xl font-bold tracking-tight text-black">
						{profile.name}
					</h1>
					<p className="mt-2 mb-12 max-w-lg text-black">
						{profile.aboutMe}
					</p>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{profile.linkedinUrl && (
							<a
								href={profile.linkedinUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="group">
								<div className="flex flex-col h-full items-center justify-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md cursor-pointer">
									<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
										<svg
											className="w-6 h-6 text-white"
											fill="currentColor"
											viewBox="0 0 24 24">
											<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
										</svg>
									</div>
									<span className="text-sm font-medium text-black group-hover:text-blue-600 transition-colors duration-300">
										LinkedIn
									</span>
								</div>
							</a>
						)}
						{profile.githubUrl && (
							<a
								href={profile.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="group">
								<div className="flex flex-col  h-full items-center justify-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md cursor-pointer">
									<div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-gray-800/30 transition-all duration-300">
										<svg
											className="w-6 h-6 text-white"
											fill="currentColor"
											viewBox="0 0 24 24">
											<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
										</svg>
									</div>
									<span className="text-sm font-medium text-black group-hover:text-gray-800 transition-colors duration-300">
										GitHub
									</span>
								</div>
							</a>
						)}
						{profile.buyMeACoffeeUrl && (
							<a
								href={profile.buyMeACoffeeUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="group">
								<div className="flex flex-col  h-full items-center justify-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md cursor-pointer">
									<div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300">
										<svg
											className="w-6 h-6 text-white"
											fill="currentColor"
											viewBox="0 0 24 24">
											<path d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004.667c.01 2.662 1.226 4.04 4.088 4.04 2.86 0 4.078-1.377 4.088-4.04l.004-.667c.012-2.668-1.105-4.194-3.178-4.904zM12 24c-3.859 0-6.5-2.141-6.5-6.5s2.641-6.5 6.5-6.5 6.5 2.141 6.5 6.5-2.641 6.5-6.5 6.5z" />
										</svg>
									</div>
									<span className="text-sm font-medium text-black group-hover:text-orange-600 transition-colors duration-300">
										Buy Me a Coffee
									</span>
								</div>
							</a>
						)}
						{profile.portfolioUrl && (
							<a
								href={profile.portfolioUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="group">
								<div className="flex flex-col  h-full items-center justify-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md cursor-pointer">
									<div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
										<svg
											className="w-6 h-6 text-white"
											fill="currentColor"
											viewBox="0 0 24 24">
											<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
									</div>
									<span className="text-sm font-medium w-full text-black group-hover:text-purple-600 transition-colors duration-300">
										Portfolio
									</span>
								</div>
							</a>
						)}
						{currentResume && (
							<div className="col-span-2 md:col-span-4 group">
								<div
									onClick={handleResumeClick}
									className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md cursor-pointer">
									<div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-green-500/30 transition-all duration-300">
										<FileText className="w-6 h-6 text-white" />
									</div>
									<span className="text-sm font-medium text-black group-hover:text-green-600 transition-colors duration-300">
										Download Resume
									</span>
								</div>
							</div>
						)}
					</div>
				</section>

				<section
					id="guestlist"
					ref={guestListSectionRef}
					className="mt-16 scroll-mt-20 p-6 rounded-t-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
					<Card className="w-full max-w-2xl mx-auto bg-white/30 backdrop-blur-lg border-2 border-white/40 shadow-2xl shadow-white/20 hover:shadow-3xl hover:shadow-white/30 transition-all duration-500 transform hover:scale-[1.02]">
						<GuestListForm
							onGuestAdded={handleNewGuest}
							networkingStatement={profile.networkingStatement}
						/>
					</Card>
					<div className="mb-6 items-center justify-center flex flex-col mt-10">
						<h2 className="text-2xl font-bold text-white mb-2">
							Recent Activity
						</h2>
						<p className="text-black/70">See who has dropped by.</p>
					</div>
					<div className="space-y-4">
						{guests.map((guest, index) => (
							<div
								key={guest.id}
								className="relative p-4 ml-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md">
								<div className="flex items-start gap-4">
									<Avatar className="ring-2 scale-150 ring-[#62AD90] shadow-lg shadow-lime-400/20 ring-2 -ml-7 my-auto relative z-10">
										{guest.profileImageUrl ? (
											<AvatarImage
												src={guest.profileImageUrl}
												alt={guest.name}
											/>
										) : null}
										<AvatarFallback
											className={cn(
												"bg-gradient-to-br text-primary-foreground",
												avatarGradients[
													index %
														avatarGradients.length
												]
											)}>
											<User />
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center gap-2 flex-wrap">
											<p className="font-semibold text-black text-lg">
												{getDisplayName(guest as Guest)}
											</p>
											<Badge
												variant="secondary"
												className="capitalize flex items-center gap-1 bg-white/20 backdrop-blur-sm border border-white/30 text-black">
												<Briefcase className="h-3 w-3" />
												{guest.role}
											</Badge>
											<p
												id="lower-left-date"
												className="text-xs text-black/60 mt-2 ">
												{formatDate(guest.createdAt)}
											</p>
										</div>
										<p className="text-sm text-black/70 mt-1">
											{guest.publicAction}
										</p>
									</div>
									<div
										id="upper-right-date"
										className="text-right hidden sm:block">
										<p className="text-xs text-black/60 whitespace-nowrap">
											{formatDate(guest.createdAt)}
										</p>
									</div>
								</div>
							</div>
						))}
						{guests.length === 0 && !isLoading && (
							<div className="text-center text-black/70 py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
								<User className="h-12 w-12 mx-auto mb-4 text-black/40" />
								<p className="text-lg font-medium">
									No guests have signed up yet.
								</p>
								<p className="text-sm mt-1">
									Be the first to leave a message!
								</p>
							</div>
						)}
					</div>
				</section>

				{/* <section className="p-6 rounded-b-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl border-t-0"> */}

				{/* </section> */}
			</div>

			<SignInModal
				isOpen={isSignInModalOpen}
				onClose={() => setIsSignInModalOpen(false)}
			/>
		</>
  )
} 