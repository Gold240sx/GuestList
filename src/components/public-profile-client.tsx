
"use client";

import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GuestListForm from "@/components/guest-list-form";
import { Github, Linkedin, Coffee, FileText, User, Briefcase, Link2 } from "lucide-react";
import type { Guest, ProfileData } from "@/lib/types";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { getGuests, getProfileData } from "@/lib/firestore";
import { Skeleton } from "./ui/skeleton";


const getDisplayName = (guest: Guest) => {
    if (guest.displayNamePref === 'anonymous') return 'Anonymous';
    if (guest.displayNamePref === 'initial') {
        const parts = guest.name.split(' ');
        const firstName = parts[0];
        const lastInitial = parts.length > 1 ? ` ${parts[parts.length - 1].charAt(0)}.` : '';
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
  const [guests, setGuests] = useState<Guest[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const guestListSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [guestsData, profileData] = await Promise.all([
          getGuests(),
          getProfileData(),
        ]);
        setGuests(guestsData);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewGuest = (newGuest: Guest) => {
    setGuests(prevGuests => [newGuest, ...prevGuests]);
  };
  
  const handleResumeClick = () => {
    if (guestListSectionRef.current) {
        guestListSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        const emailInput = guestListSectionRef.current.querySelector<HTMLInputElement>('#email-guestbook');
        if (emailInput) {
            emailInput.focus();
        }
    }
  }

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
    <div className="container max-w-2xl mx-auto px-4 py-8 md:py-12">
      <section className="flex flex-col items-center text-center">
        <div className="w-48 h-48 relative mb-4">
           <Image
              src={profile.profilePictureUrl}
              alt="Profile Picture"
              width={400}
              height={400}
              data-ai-hint="profile picture"
              className="rounded-full object-cover border-4 border-card"
            />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
        <p className="mt-2 max-w-lg text-muted-foreground">{profile.aboutMe}</p>
      </section>

      <section className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.linkedinUrl && <Button asChild size="lg" variant="outline">
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin /> LinkedIn
                </a>
            </Button>}
            {profile.githubUrl && <Button asChild size="lg" variant="outline">
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github /> GitHub
                </a>
            </Button>}
            {profile.buyMeACoffeeUrl && <Button asChild size="lg" variant="outline">
                <a href={profile.buyMeACoffeeUrl} target="_blank" rel="noopener noreferrer">
                    <Coffee /> Buy Me a Coffee
                </a>
            </Button>}
            {profile.portfolioUrl && <Button asChild size="lg" variant="outline">
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                    <Link2 /> Portfolio
                </a>
            </Button>}
             {profile.resumeUrl && <Button onClick={handleResumeClick} size="lg" variant="outline" className="sm:col-span-2">
                <FileText /> Download Resume
            </Button>}
        </div>
      </section>

      <section id="guestlist" ref={guestListSectionRef} className="mt-12 scroll-mt-20">
        <GuestListForm onGuestAdded={handleNewGuest} networkingStatement={profile.networkingStatement} />
      </section>

      <section className="mt-12">
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>See who has dropped by.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {guests.map((guest, index) => (
                    <div key={guest.id} className="flex items-center gap-4 p-3 rounded-lg border bg-background/50">
                        <Avatar>
                            <AvatarFallback className={cn("bg-gradient-to-br text-primary-foreground", avatarGradients[index % avatarGradients.length])}>
                              <User />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                             <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold">{getDisplayName(guest)}</p>
                                <Badge variant="secondary" className="capitalize flex items-center gap-1">
                                    <Briefcase className="h-3 w-3" />
                                    {guest.role}
                                </Badge>
                             </div>
                            <p className="text-sm text-muted-foreground mt-1">{guest.publicAction}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(guest.createdAt)}</p>
                        </div>
                    </div>
                ))}
                 {guests.length === 0 && !isLoading && (
                    <div className="text-center text-muted-foreground py-8">No guests have signed up yet.</div>
                )}
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
