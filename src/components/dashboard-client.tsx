
"use client";

import { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Guest, ProfileData } from "@/lib/types";
import {
  Copy,
  Trash,
  User,
  Users,
  Settings,
  Mail,
  Github,
  Linkedin,
  Coffee,
  FileText,
  Briefcase,
  MessageSquareQuote,
  MoreVertical,
  Phone,
  MessageSquare,
  Upload,
  Link2,
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteGuest, getGuests, getProfileData, updateProfileData } from "@/lib/firestore";
import { Skeleton } from "./ui/skeleton";


const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function DashboardClient() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);


  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
        toast({title: `${label} Copied`, description: `${text} has been copied to your clipboard.`})
    }).catch(err => {
        toast({variant: 'destructive', title: "Copy Failed", description: "Could not copy to clipboard."})
    })
  }

  const handleDeleteGuest = async (id: string) => {
    const guestToDelete = guests.find(guest => guest.id === id);
    if(guestToDelete) {
        try {
            await deleteGuest(id);
            setGuests(prev => prev.filter(guest => guest.id !== id));
            toast({ title: "Guest Removed", description: `"${guestToDelete.name}" has been removed.` });
        } catch (error) {
            toast({ variant: 'destructive', title: "Delete Failed", description: "Could not remove guest."})
        }
    }
  };

  const handleProfileUpdate = async () => {
    if (!profile) return;
    try {
        await updateProfileData(profile);
        toast({ title: "Profile Updated", description: "Your profile information has been saved."});
    } catch (error) {
        toast({variant: 'destructive', title: "Update Failed", description: "Could not save profile."})
    }
  }
  
  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && profile) {
      // In a real app, you would upload this file to storage (e.g., Firebase Storage)
      // and get a downloadable URL. For this prototype, we'll use a local URL.
      const newProfilePicUrl = URL.createObjectURL(file);
      setProfile({...profile, profilePictureUrl: newProfilePicUrl });
      toast({
        title: "Profile Picture Updated",
        description: "Your new profile picture has been set. Click Save to persist.",
      });
    }
  };


  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && profile) {
      // In a real app, you would upload this file to storage (e.g., Firebase Storage)
      // and get a downloadable URL. For this prototype, we'll just mock it.
      const newResumeUrl = `/resumes/${file.name}`;
      setProfile({ ...profile, resumeUrl: newResumeUrl });
      toast({
        title: "Resume Uploaded",
        description: `Your new resume is available at: ${newResumeUrl}. Click Save to persist.`,
      });
    }
  };
  
  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    if(profile) {
        setProfile({ ...profile, [field]: value });
    }
  }

  if (isLoading) {
      return (
          <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="md:col-span-1 space-y-8">
                  <Skeleton className="h-48 w-full sticky top-20" />
              </div>
          </div>
      )
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border">
                <AvatarImage src={profile?.profilePictureUrl} data-ai-hint="profile picture" />
                <AvatarFallback><User size={40}/></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-bold">{profile?.name || 'Admin'}</CardTitle>
                <CardDescription className="text-lg">Welcome to your dashboard</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your public-facing information here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="profile-picture">Profile Picture</Label>
                     <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <Input id="profile-picture" type="file" onChange={handleProfilePictureUpload} accept="image/*" className="file:text-foreground"/>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={profile?.name || ''} onChange={(e) => handleFieldChange('name', e.target.value)} placeholder="Your Name"/>
                </div>
                <div className="grid gap-2">
                <Label htmlFor="about-me">About Me</Label>
                <Textarea id="about-me" value={profile?.aboutMe || ''} onChange={(e) => handleFieldChange('aboutMe', e.target.value)} placeholder="A short bio about yourself."/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="networking-statement">Networking Statement</Label>
                <Textarea id="networking-statement" value={profile?.networkingStatement || ''} onChange={(e) => handleFieldChange('networkingStatement', e.target.value)} placeholder="Your networking pitch."/>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5 text-muted-foreground"/>
                    <Input id="linkedin" value={profile?.linkedinUrl || ''} onChange={(e) => handleFieldChange('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..."/>
                  </div>
                </div>
                  <div className="grid gap-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-muted-foreground"/>
                    <Input id="github" value={profile?.githubUrl || ''} onChange={(e) => handleFieldChange('githubUrl', e.target.value)} placeholder="https://github.com/..."/>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="buy-me-a-coffee">Buy Me a Coffee URL</Label>
                  <div className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-muted-foreground"/>
                    <Input id="buy-me-a-coffee" value={profile?.buyMeACoffeeUrl || ''} onChange={(e) => handleFieldChange('buyMeACoffeeUrl', e.target.value)} placeholder="https://buymeacoffee.com/..."/>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <div className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-muted-foreground"/>
                    <Input id="portfolio" value={profile?.portfolioUrl || ''} onChange={(e) => handleFieldChange('portfolioUrl', e.target.value)} placeholder="https://your-portfolio.com"/>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="resume">Resume Document</Label>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground"/>
                  <Input id="resume" type="file" onChange={handleResumeUpload} className="file:text-foreground"/>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current: <a href={profile?.resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">{profile?.resumeUrl}</a>
                </p>
              </div>
            </CardContent>
            <CardFooter>
                 <Button type="button" onClick={handleProfileUpdate}>Save Profile</Button>
            </CardFooter>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users /> Guest List</CardTitle>
            <CardDescription>Here are the guests who have signed up.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {guests.map((guest) => (
              <div key={guest.id} className="flex items-start gap-4 p-3 rounded-lg border bg-background">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{guest.name}</p>
                    <Badge variant="secondary" className="capitalize flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {guest.role}
                    </Badge>
                     <Badge variant="outline" className="capitalize flex items-center gap-1">
                      <MessageSquareQuote className="h-3 w-3" />
                      {guest.publicAction}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground"/>
                        <span className="text-sm text-muted-foreground">{guest.email}</span>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild><a href={`mailto:${guest.email}`}><Mail className="mr-2"/>Email</a></DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyToClipboard(guest.email, 'Email Address')}><Copy className="mr-2"/>Copy</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                     {guest.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-sm text-muted-foreground">{guest.phone}</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild><a href={`tel:${guest.phone}`}><Phone className="mr-2"/>Call</a></DropdownMenuItem>
                                    <DropdownMenuItem asChild><a href={`sms:${guest.phone}`}><MessageSquare className="mr-2"/>Text</a></DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => copyToClipboard(guest.phone, 'Phone Number')}><Copy className="mr-2"/>Copy</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                     )}
                  </div>
                   {guest.note && <p className="text-sm mt-2 font-medium bg-muted/50 p-2 rounded-md">{guest.note}</p>}
                   <p className="text-xs text-muted-foreground mt-2">{formatDate(guest.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" aria-label="Delete Guest" onClick={() => handleDeleteGuest(guest.id)}>
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
             {guests.length === 0 && !isLoading && (
                <div className="text-center text-muted-foreground py-8">No guests have signed up yet.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1 space-y-8">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-accent" />
              Admin Settings
            </CardTitle>
            <CardDescription>
              Configure your notification settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="notification-email">Notification Email</Label>
              <div className="flex items-center gap-2">
                 <Mail className="h-5 w-5 text-muted-foreground"/>
                 <Input
                    id="notification-email"
                    type="email"
                    value={profile?.notificationEmail || ''}
                    onChange={(e) => handleFieldChange('notificationEmail', e.target.value)}
                    placeholder="your.email@example.com"
                />
              </div>
            </div>
          </CardContent>
           <CardFooter>
            <Button onClick={handleProfileUpdate} className="w-full">
                Update Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
