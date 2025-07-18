"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { User, Mail, Phone, Calendar, Trash2, Copy, Upload, Linkedin, Github, Coffee, Link2, FileText, Eye, EyeOff, MoreVertical, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Guest, ProfileData, ProfileFormData } from "@/lib/types";
import { UploadButton } from "@/utils/uploadthing";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const avatarGradients = [
  'from-pink-500 to-yellow-500',
  'from-green-400 to-blue-500',
  'from-purple-500 to-indigo-500',
  'from-red-500 to-orange-500',
  'from-teal-400 to-cyan-500',
]

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

const getGuestsInTimeRange = (guests: Guest[], days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return guests.filter(guest => 
        guest.createdAt && new Date(guest.createdAt) > cutoffDate
    ).length;
}

const getGuestsToday = (guests: Guest[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return guests.filter(guest => {
        const guestDate = new Date(guest.createdAt);
        return guestDate >= today && guestDate < tomorrow;
    }).length;
}

export default function DashboardClient() {
  const { toast } = useToast();
  const utils = api.useUtils();
  
  const { data: guests = [], isLoading: guestsLoading } = api.guest.getAll.useQuery({ includeHidden: true });
  const { data: profile, isLoading: profileLoading } = api.profile.get.useQuery();
  const { data: resumes = [], isLoading: resumesLoading } = api.resume.getAll.useQuery();

  // Local state for form fields
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    aboutMe: "",
    networkingStatement: "",
    profilePictureUrl: "",
    appIconUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    buyMeACoffeeUrl: "",
    portfolioUrl: "",
    resumeUrl: "",
    notificationEmail: "",
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        aboutMe: profile.aboutMe || "",
        networkingStatement: profile.networkingStatement || "",
        profilePictureUrl: profile.profilePictureUrl || "",
        appIconUrl: profile.appIconUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
        githubUrl: profile.githubUrl || "",
        buyMeACoffeeUrl: profile.buyMeACoffeeUrl || "",
        portfolioUrl: profile.portfolioUrl || "",
        resumeUrl: profile.resumeUrl || "",
        notificationEmail: profile.notificationEmail || "",
      });
    }
  }, [profile]);

  const deleteGuest = api.guest.delete.useMutation({
    onSuccess: async () => {
      await utils.guest.getAll.invalidate();
      toast({ title: "Guest Removed", description: "The guest has been removed from your list." });
    },
    onError: () => {
      toast({ variant: 'destructive', title: "Delete Failed", description: "Could not remove guest." });
    }
  });

  const toggleGuestHidden = api.guest.toggleHidden.useMutation({
    onSuccess: async () => {
      await utils.guest.getAll.invalidate();
      toast({ title: "Guest Status Updated", description: "The guest visibility has been toggled." });
    },
    onError: () => {
      toast({ variant: 'destructive', title: "Update Failed", description: "Could not update guest status." });
    }
  });
  
  const updateProfile = api.profile.update.useMutation({
    onSuccess: async () => {
      await utils.profile.get.invalidate();
      toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast({ variant: 'destructive', title: "Update Failed", description: "Could not save profile." });
    }
  });

  const setCurrentResume = api.resume.setCurrent.useMutation({
    onSuccess: async () => {
      await utils.resume.getAll.invalidate();
      await utils.resume.getCurrent.invalidate();
      toast({ title: "Resume Updated", description: "This resume is now your current resume." });
    },
    onError: (error) => {
      console.error("Set current resume error:", error);
      toast({ variant: 'destructive', title: "Update Failed", description: "Could not set resume as current." });
    }
  });

  const deleteResume = api.resume.delete.useMutation({
    onSuccess: async () => {
      await utils.resume.getAll.invalidate();
      await utils.resume.getCurrent.invalidate();
      toast({ title: "Resume Deleted", description: "The resume has been removed." });
    },
    onError: (error) => {
      console.error("Delete resume error:", error);
      toast({ variant: 'destructive', title: "Delete Failed", description: error.message || "Could not delete resume." });
    }
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
        toast({title: `${label} Copied`, description: `${text} has been copied to your clipboard.`})
    }).catch(err => {
        toast({variant: 'destructive', title: "Copy Failed", description: "Could not copy to clipboard."})
    })
  }

  const handleDeleteGuest = async (id: number) => {
    const guestToDelete = guests.find(guest => guest.id === id);
    if(guestToDelete) {
        deleteGuest.mutate({ id });
    }
  };

  const handleToggleGuestHidden = async (id: number) => {
    toggleGuestHidden.mutate({ id });
  };

  const handleDeleteResume = async (id: number) => {
    deleteResume.mutate({ id });
  };

  const handleProfileUpdate = async () => {
    updateProfile.mutate({
      name: formData.name,
      aboutMe: formData.aboutMe,
      networkingStatement: formData.networkingStatement,
      profilePictureUrl: formData.profilePictureUrl,
      appIconUrl: formData.appIconUrl || undefined,
      linkedinUrl: formData.linkedinUrl || undefined,
      githubUrl: formData.githubUrl || undefined,
      buyMeACoffeeUrl: formData.buyMeACoffeeUrl || undefined,
      portfolioUrl: formData.portfolioUrl || undefined,
      resumeUrl: formData.resumeUrl || undefined,
      notificationEmail: formData.notificationEmail,
    });
  }
  
  const handleProfilePictureUpload = (res: any) => {
    if (res && res[0]) {
      const file = res[0];
      setFormData(prev => ({ ...prev, profilePictureUrl: file.url }));
      toast({
        title: "Profile Picture Updated",
        description: `Your profile picture "${file.name}" has been uploaded successfully.`,
      });
      // Refresh the profile
      utils.profile.get.invalidate();
    }
  };

  const handleResumeUpload = (res: any) => {
    if (res && res[0]) {
      const file = res[0];
      setFormData(prev => ({ ...prev, resumeUrl: file.url }));
      toast({
        title: "Resume Uploaded",
        description: `Your resume "${file.name}" has been uploaded successfully and is now active.`,
      });
      // Refresh the resumes list
      utils.resume.getAll.invalidate();
    }
  };

  const handleAppIconUpload = (res: any) => {
    if (res && res[0]) {
      const file = res[0];
      setFormData(prev => ({ ...prev, appIconUrl: file.url }));
      toast({
        title: "App Icon Updated",
        description: `Your app icon "${file.name}" has been uploaded successfully.`,
      });
      // Refresh the profile
      utils.profile.get.invalidate();
    }
  };
  
  const handleFieldChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const isLoading = guestsLoading || profileLoading || resumesLoading;

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
		<div className="space-y-8">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div className="flex items-center gap-4">
						<Avatar className="h-20 w-20 border">
							<AvatarImage
								src={formData.profilePictureUrl}
								data-ai-hint="profile picture"
							/>
							<AvatarFallback>
								<User size={40} />
							</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle className="text-3xl font-bold">
								{formData.name || "Admin"}
							</CardTitle>
							<CardDescription className="text-lg">
								Welcome to your dashboard
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center p-4 rounded-lg bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
								<div className="text-2xl font-bold text-primary">
									{guests.length}
								</div>
								<div className="text-sm text-muted-foreground">
									Total Guests
								</div>
							</div>
							<div className="text-center p-4 rounded-lg bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
								<div className="text-2xl font-bold text-green-500">
									{guests.filter((guest) => !guest.hidden).length}
								</div>
								<div className="text-sm text-muted-foreground">
									Visible
								</div>
							</div>
							<div className="text-center p-4 rounded-lg bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
								<div className="text-2xl font-bold text-blue-500">
									{guests.filter((guest) => guest.hidden).length}
								</div>
								<div className="text-sm text-muted-foreground">
									Hidden
								</div>
							</div>
							<div className="text-center p-4 rounded-lg bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
								<div className="text-2xl font-bold text-purple-500">
									{resumes.length}
								</div>
								<div className="text-sm text-muted-foreground">
									Resumes
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							<div className="text-center p-4 rounded-lg bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
								<div className="text-2xl font-bold text-orange-500">
									{getGuestsToday(guests as Guest[])}
								</div>
								<div className="text-sm text-muted-foreground">
									Today
								</div>
							</div>
							<div className="text-center p-4 rounded-lg bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
								<div className="text-2xl font-bold text-yellow-500">
									{getGuestsInTimeRange(guests as Guest[], 7)}
								</div>
								<div className="text-sm text-muted-foreground">
									This Week
								</div>
							</div>
							<div className="text-center p-4 rounded-lg bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
								<div className="text-2xl font-bold text-purple-500">
									{getGuestsInTimeRange(guests as Guest[], 30)}
								</div>
								<div className="text-sm text-muted-foreground">
									This Month
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-4xl font-bold">
						Edit Profile
					</CardTitle>
					<CardDescription>
						Update your public-facing information here. Click save
						when you're done.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-6 py-4">
					<div className="grid gap-4 lg:grid-cols-2">
						<div className="grid gap-2">
							<Label htmlFor="profile-picture">
								Profile Picture
							</Label>
							<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:border-muted-foreground/40 transition-colors bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
								<div className="h-20 w-20 flex items-center justify-center">
									{formData.profilePictureUrl ? (
										<img
											src={formData.profilePictureUrl}
											alt="Profile Picture"
											className="h-20 w-20 rounded-full object-cover"
										/>
									) : (
										<User className="h-12 w-12 text-muted-foreground/60" />
									)}
								</div>
								<div className="text-center">
									<p className="text-sm text-muted-foreground mb-2">
										Upload your profile picture (PNG, JPG,
										JPEG)
									</p>
									<UploadButton
										endpoint="profilePictureUploader"
										onClientUploadComplete={
											handleProfilePictureUpload
										}
										onUploadError={(error: Error) => {
											toast({
												variant: "destructive",
												title: "Upload Failed",
												description: `Error: ${error.message}`,
											})
										}}
										className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
									/>
								</div>
							</div>
							{formData.profilePictureUrl && (
								<p className="text-sm text-muted-foreground text-center">
									Current:{" "}
									<a
										href={formData.profilePictureUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="underline">
										{formData.profilePictureUrl
											.split("/")
											.pop()}
									</a>
								</p>
							)}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="app-icon">App Icon</Label>
							<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:border-muted-foreground/40 transition-colors bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
								<div className="h-10 w-16 flex items-center justify-center">
									{formData.appIconUrl ? (
										<img
											src={formData.appIconUrl}
											alt="App Icon"
											className="h-10 w-16 rounded-lg object-cover"
										/>
									) : (
										<User className="h-12 w-12 text-muted-foreground/60" />
									)}
								</div>
								<div className="text-center">
									<p className="text-sm text-muted-foreground mb-2">
										Upload your app icon (PNG, JPG, SVG)
									</p>
									<UploadButton
										endpoint="appIconUploader"
										onClientUploadComplete={
											handleAppIconUpload
										}
										onUploadError={(error: Error) => {
											toast({
												variant: "destructive",
												title: "Upload Failed",
												description: `Error: ${error.message}`,
											})
										}}
										className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
									/>
								</div>
							</div>
							{formData.appIconUrl && (
								<p className="text-sm text-muted-foreground text-center">
									Current:{" "}
									<a
										href={formData.appIconUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="underline">
										{formData.appIconUrl.split("/").pop()}
									</a>
								</p>
							)}
						</div>
					</div>
					<div className="grid gap-2">
						<Label
							htmlFor="name"
							className="text-2xl font-semibold">
							Name
						</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) =>
								handleFieldChange("name", e.target.value)
							}
							placeholder="Your Name"
							className="text-xl p-2 bg-slate-800"
						/>
					</div>
					<div className="grid gap-2">
						<Label
							htmlFor="about-me"
							className="text-2xl font-semibold">
							About Me
						</Label>
						<Textarea
							id="about-me"
							value={formData.aboutMe}
							onChange={(e) =>
								handleFieldChange("aboutMe", e.target.value)
							}
							placeholder="A short bio about yourself."
							className="text-xl p-2 bg-slate-800 h-[150px]"
						/>
					</div>
					<div className="grid gap-2">
						<Label
							htmlFor="networking-statement"
							className="text-2xl font-semibold">
							Networking Statement
						</Label>
						<Textarea
							id="networking-statement"
							value={formData.networkingStatement}
							onChange={(e) =>
								handleFieldChange(
									"networkingStatement",
									e.target.value
								)
							}
							placeholder="Your networking pitch."
							className="text-xl p-2 bg-slate-800 h-[150px]"
						/>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 pt-8">
						<div className="grid gap-2">
							<Label
								htmlFor="linkedin"
								className="text-2xl font-semibold">
								LinkedIn URL
							</Label>
							<div className="flex items-center gap-2">
								<Linkedin className="h-5 w-5 text-muted-foreground" />
								<Input
									id="linkedin"
									value={formData.linkedinUrl || ""}
									onChange={(e) =>
										handleFieldChange(
											"linkedinUrl",
											e.target.value
										)
									}
									placeholder="https://linkedin.com/in/..."
									className="text-xl p-2 bg-slate-800"
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label
								htmlFor="github"
								className="text-2xl font-semibold">
								GitHub URL
							</Label>
							<div className="flex items-center gap-2">
								<Github className="h-5 w-5 text-muted-foreground" />
								<Input
									id="github"
									value={formData.githubUrl || ""}
									onChange={(e) =>
										handleFieldChange(
											"githubUrl",
											e.target.value
										)
									}
									placeholder="https://github.com/..."
									className="text-xl p-2 bg-slate-800"
								/>
							</div>
						</div>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="grid gap-2">
							<Label
								htmlFor="buy-me-a-coffee"
								className="text-2xl font-semibold">
								Buy Me a Coffee URL
							</Label>
							<div className="flex items-center gap-2">
								<Coffee className="h-5 w-5 text-muted-foreground" />
								<Input
									id="buy-me-a-coffee"
									value={formData.buyMeACoffeeUrl || ""}
									onChange={(e) =>
										handleFieldChange(
											"buyMeACoffeeUrl",
											e.target.value
										)
									}
									placeholder="https://buymeacoffee.com/..."
									className="text-xl p-2 bg-slate-800"
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label
								htmlFor="portfolio"
								className="text-2xl font-semibold">
								Portfolio URL
							</Label>
							<div className="flex items-center gap-2">
								<Link2 className="h-5 w-5 text-muted-foreground" />
								<Input
									id="portfolio"
									value={formData.portfolioUrl || ""}
									onChange={(e) =>
										handleFieldChange(
											"portfolioUrl",
											e.target.value
										)
									}
									placeholder="https://your-portfolio.com"
									className="text-xl p-2 bg-slate-800"
								/>
							</div>
						</div>
					</div>
					<div className="grid gap-2">
						<Label
							htmlFor="notification-email"
							className="text-2xl font-semibold">
							Notification Email
						</Label>
						<div className="flex items-center gap-2">
							<Mail className="h-5 w-5 text-muted-foreground" />
							<Input
								id="notification-email"
								value={formData.notificationEmail}
								onChange={(e) =>
									handleFieldChange(
										"notificationEmail",
										e.target.value
									)
								}
								placeholder="admin@example.com"
								className="text-xl p-2 bg-slate-800"
							/>
						</div>
					</div>
					<div className="grid gap-2 my-6">
						<Label htmlFor="resume">Resume File</Label>
						<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:border-muted-foreground/40 transition-colors">
							<FileText className="h-12 w-12 text-muted-foreground/60" />
							<div className="text-center">
								<p className="text-sm text-muted-foreground mb-2">
									Upload your resume (PDF, DOC, DOCX)
								</p>
								<UploadButton
									endpoint="resumeUploader"
									onClientUploadComplete={handleResumeUpload}
									onUploadError={(error: Error) => {
										toast({
											variant: "destructive",
											title: "Upload Failed",
											description: `Error: ${error.message}`,
										})
									}}
									className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
								/>
							</div>
						</div>
						{formData.resumeUrl && (
							<p className="text-sm text-muted-foreground text-center">
								Current:{" "}
								<a
									href={formData.resumeUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="underline">
									{formData.resumeUrl.split("/").pop()}
								</a>
							</p>
						)}
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						onClick={handleProfileUpdate}
						disabled={updateProfile.isPending}>
						{updateProfile.isPending ? "Saving..." : "Save Changes"}
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-4xl font-bold">
						Resume Management
					</CardTitle>
					<CardDescription>
						Manage your uploaded resumes. New uploads automatically
						become current, or you can set any previous resume as
						current.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<TooltipProvider>
						{resumes.map((resume) => (
							<div
								key={resume.id}
								className="flex items-center justify-between p-4 border rounded-lg bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
								<div className="flex items-center gap-4">
									<FileText className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="font-semibold">
											{resume.fileName}
										</p>
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Badge
												variant={
													resume.isCurrent
														? "default"
														: "secondary"
												}>
												{resume.isCurrent
													? "Current"
													: "Previous"}
											</Badge>
											<span>•</span>
											<span>
												{(
													resume.fileSize /
													1024 /
													1024
												).toFixed(2)}{" "}
												MB
											</span>
											<span>•</span>
											<span>
												{resume.downloadCount} downloads
											</span>
											<span>•</span>
											<span>
												{formatDate(resume.createdAt)}
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													window.open(
														resume.fileUrl,
														"_blank"
													)
												}>
												<Copy className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Download resume</p>
										</TooltipContent>
									</Tooltip>
									{!resume.isCurrent && (
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														setCurrentResume.mutate(
															{
																id: resume.id,
															}
														)
													}
													disabled={
														setCurrentResume.isPending
													}>
													<FileText className="h-4 w-4" />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Set as current resume</p>
											</TooltipContent>
										</Tooltip>
									)}
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													handleDeleteResume(
														resume.id
													)
												}
												disabled={
													deleteResume.isPending
												}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Delete resume</p>
										</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													handleDeleteResume(
														resume.id
													)
												}
												disabled={
													deleteResume.isPending
												}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Delete resume</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</div>
						))}
						{resumes.length === 0 && (
							<div className="text-center py-8 text-muted-foreground">
								No resumes uploaded yet. Use the upload button
								above to add your first resume.
							</div>
						)}
					</TooltipProvider>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-4xl font-bold">
						Recent Guests
					</CardTitle>
					<CardDescription>
						People who have visited your profile recently.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{guests.map((guest, index) => (
						<div
							key={guest.id}
							className="flex items-center justify-between p-4 border rounded-lg bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
							<div className="flex items-center gap-4">
								<Avatar>
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
												index % avatarGradients.length
											]
										)}>
										{getDisplayName(guest as Guest).charAt(
											0
										)}
									</AvatarFallback>
								</Avatar>
								<div>
																			<div className="flex items-center gap-2">
											<p className="font-semibold">
												{getDisplayName(guest as Guest)}
											</p>
											<Badge 
												variant="secondary" 
												className="text-xs bg-black/50 rounded-full">
												{guest.publicAction}
											</Badge>
											<Badge variant="secondary" className="text-xs">
												{guest.role}
											</Badge>
											<span className="text-xs text-muted-foreground">
												{formatDate(guest.createdAt)}
											</span>
											{guest.hidden && (
												<Badge
													variant="destructive"
													className="text-xs">
													Hidden
												</Badge>
											)}
										</div>
									<div className="flex items-center gap-4 mt-2">
										{guest.email && (
											<div className="flex items-center gap-2">
												<Mail className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm text-muted-foreground">
													{guest.email}
												</span>
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-6 w-6">
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															asChild>
															<a
																href={`mailto:${guest.email}`}>
																<Mail className="mr-2 h-4 w-4" />
																Email
															</a>
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																copyToClipboard(
																	guest.email,
																	"Email Address"
																)
															}>
															<Copy className="mr-2 h-4 w-4" />
															Copy
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										)}
										{guest.phone && (
											<div className="flex items-center gap-2">
												<Phone className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm text-muted-foreground">
													{guest.phone}
												</span>
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-6 w-6">
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															asChild>
															<a
																href={`tel:${guest.phone}`}>
																<Phone className="mr-2 h-4 w-4" />
																Call
															</a>
														</DropdownMenuItem>
														<DropdownMenuItem
															asChild>
															<a
																href={`sms:${guest.phone}`}>
																<MessageSquare className="mr-2 h-4 w-4" />
																Text
															</a>
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																copyToClipboard(
																	guest.phone ||
																		"",
																	"Phone Number"
																)
															}>
															<Copy className="mr-2 h-4 w-4" />
															Copy
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										)}
									</div>
									{guest.note && (
										<p className="text-lg mt-2">
											" {guest.note} "
										</p>
									)}
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleDeleteGuest(guest.id)}>
									<Trash2 className="h-4 w-4" />
								</Button>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												handleToggleGuestHidden(
													guest.id
												)
											}
											disabled={
												toggleGuestHidden.isPending
											}>
											{guest.hidden ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											{guest.hidden
												? "Show Guest"
												: "Hide Guest"}
										</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
					))}
					{guests.length === 0 && (
						<div className="text-center py-8 text-muted-foreground">
							No guests have visited yet.
						</div>
					)}
				</CardContent>
			</Card>
		</div>
  )
} 