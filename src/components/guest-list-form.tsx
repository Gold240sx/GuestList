"use client";

import React, { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileDown, Send } from "lucide-react";
import type { DisplayNamePref, Guest, RoleOption, PublicAction } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { api } from "@/trpc/react";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface GuestListFormProps {
  onGuestAdded: (guest: Guest) => void;
  networkingStatement: string;
}

const roleOptions: RoleOption[] = ["business owner", "recruiter", "developer", "hiring manager", "professional", "friend", "other"];
const publicActionOptions: PublicAction[] = ["Just saying hi!", "Let's connect!"];

// Zod schemas for validation
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const guestDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional().refine((val) => {
    if (!val) return true;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(val.replace(/[\s\-\(\)]/g, ''));
  }, "Please enter a valid phone number"),
  note: z.string().optional(),
  role: z.enum(["business owner", "recruiter", "developer", "hiring manager", "professional", "friend", "other"]),
  publicAction: z.enum(["Just saying hi!", "Let's connect!", "Downloaded the resume"]),
  displayNamePref: z.enum(["full", "initial", "anonymous"]),
});

type EmailFormData = z.infer<typeof emailSchema>;
type GuestDetailsFormData = z.infer<typeof guestDetailsSchema>;

export default function GuestListForm({ onGuestAdded, networkingStatement }: GuestListFormProps) {
  const [step, setStep] = useState<"email" | "details">("email");
  const [intent, setIntent] = useState<"guestbook" | "resume">("guestbook");
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  
  const { toast } = useToast();
  const utils = api.useUtils();
  const { user, isSignedIn } = useUser();

  // Email form
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Guest details form
  const detailsForm = useForm<GuestDetailsFormData>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: {
      name: "",
      phone: "",
      note: "",
      role: "other",
      publicAction: "Just saying hi!",
      displayNamePref: "full",
    },
  });

  // Update form when user signs in
  React.useEffect(() => {
    if (isSignedIn && user) {
      emailForm.setValue("email", user.primaryEmailAddress?.emailAddress || "");
      detailsForm.setValue("name", user.fullName || "");
      setProfileImageUrl(user.imageUrl || "");
    }
  }, [isSignedIn, user, emailForm, detailsForm]);
  
  const createGuest = api.guest.create.useMutation({
    onSuccess: async (newGuest) => {
      await utils.guest.getAll.invalidate();
      if (newGuest) {
        onGuestAdded(newGuest as Guest);
      }
      
      if (intent === 'resume') {
        // Trigger download in browser
        window.open("/resume.pdf", "_blank");
        toast({
          title: "Thank You & Check Your Email!",
          description: "You've been added to the guest list and the resume link has been sent to your email."
        });
      } else {
        toast({
          title: "Thank you!",
          description: "You've been added to the guest list."
        });
      }
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.message
      });
    }
  });

  const handleEmailSubmit = emailForm.handleSubmit((data) => {
    setStep("details");
  });

  const resetForm = () => {
    emailForm.reset();
    detailsForm.reset();
    setProfileImageUrl('');
    setStep('email');
    setIntent('guestbook');
  }

  const handleDetailsSubmit = detailsForm.handleSubmit(async (data) => {
    const finalPublicAction = intent === 'resume' ? 'Downloaded the resume' : data.publicAction;

    createGuest.mutate({
      name: data.name,
      phone: data.phone || undefined,
      email: emailForm.getValues("email"),
      note: data.note || undefined,
      role: data.role,
      publicAction: finalPublicAction,
      displayNamePref: data.displayNamePref,
      profileImageUrl: profileImageUrl || undefined,
    });
  });

  if (step === "email") {
    return (
		<>
			<CardHeader className="text-center pb-8">
				<CardTitle className="text-5xl font-bold text-black mb-4 bg-gradient-to-r from-lime-600 to-cyan-600 bg-clip-text text-transparent">
					Get In Touch
				</CardTitle>
				<CardDescription className="text-xl text-black/80 leading-relaxed max-w-2xl mx-auto">
					{networkingStatement}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{isSignedIn && user && (
					<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
						<Avatar className="h-10 w-10">
							<AvatarImage
								src={user.imageUrl}
								alt={user.fullName || "User"}
							/>
							<AvatarFallback>
								{user.firstName?.[0]}
								{user.lastName?.[0]}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<p className="font-medium text-black">
								{user.fullName}
							</p>
							<p className="text-sm text-black">
								{user.primaryEmailAddress?.emailAddress}
							</p>
						</div>
						<SignOutButton>
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-foreground">
								Sign Out
							</Button>
						</SignOutButton>
					</div>
				)}

				{!isSignedIn && (
					<>
						<div className="text-center space-y-4">
							<p className="text-base text-black font-medium">
								Quick sign-in with Google to add your avatar
							</p>
							<SignInButton
								mode="modal"
								appearance={{
									elements: {
										rootBox: "w-full",
										card: "bg-card border border-border shadow-lg",
										socialButtonsBlockButton:
											"bg-secondary hover:bg-secondary/80 text-secondary-foreground",
										formButtonPrimary:
											"bg-primary hover:bg-primary/90 text-primary-foreground",
									},
								}}>
								<Button
									variant="outline"
									className="w-3/4 group md:w-1/2 max-w-screen-sm h-10 text-sm font-medium border border-white/30 hover:border-white/50 hover:bg-black transition-all duration-75 shadow-sm hover:shadow-md rounded-xl">
									<svg
										className="mr-2 h-4 w-4 group-hover:saturate-100 saturate-0 transition-all duration-75"
										viewBox="0 0 24 24">
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
									<p className="opacity-50 group-hover:opacity-100 transition-all duration-75">Sign in with Google</p>
								</Button>
							</SignInButton>
						</div>

						<div className="relative">
							<div className="relative flex justify-center text-xs uppercase">
								<span className="px-3 py-1 text-black/60 bg-white/10 rounded-xl">
									Or continue without signing in
								</span>
							</div>
						</div>
					</>
				)}

				<form id="email-form-guestbook" onSubmit={handleEmailSubmit}>
					<Label htmlFor="email" className="sr-only">
						Email
					</Label>
					<Input
						id="email-guestbook"
						type="email"
						placeholder="you@example.com"
						required
						{...emailForm.register("email")}
						className={cn(
							" text-base bg-transparent shadow-inner placeholder:text-black/50 border-2 border-white/30 focus:border-lime-400 focus:placeholder:opacity-0 focus:ring-2 focus:ring-offset-1 focus:ring-lime-400/20 focus-visible:ring-lime-400/20 focus-visible:ring-offset-1 focus-visible:border-lime-400 hover:bg-white/20 transition-all rounded-2xl duration-300",
							emailForm.formState.errors.email &&
								"border-red-500 focus-visible:ring-red-500"
						)}
					/>
					{emailForm.formState.errors.email && (
						<p className="text-red-500 text-sm mt-1">
							{emailForm.formState.errors.email.message}
						</p>
					)}
				</form>
			</CardContent>
			<CardFooter className="flex-col sm:flex-row gap-4 pt-8">
				<Button
					type="submit"
					form="email-form-guestbook"
					className={cn(
						"w-full h-10 text-xl font-semibold transition-all duration-300 transform rounded-xl",
						emailForm.watch("email")
							? "bg-gradient-to-r from-lime-500 to-cyan-500 hover:from-lime-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl hover:shadow-lime-500/25 hover:scale-[1.02] border-2 border-lime-400/50"
							: "bg-white/10 text-black/30 border-2 border-white/20 cursor-not-allowed opacity-30"
					)}
					disabled={!emailForm.watch("email")}>
					<Send className="mr-3 h-6 w-6" />
					Sign Guest Book & Continue
				</Button>
			</CardFooter>
		</>
	)
  }

  return (
		<>
			<CardHeader className="text-center pb-8">
				<CardTitle className="text-5xl font-bold text-black mb-4 bg-gradient-to-r from-lime-600 to-cyan-600 bg-clip-text text-transparent">
					Guest Details
				</CardTitle>
				<CardDescription className="text-xl text-black/90">
					Just a few more details. You can
					<Button
						variant="link"
						onClick={() => setStep("email")}
						className="px-1 text-lime-600 hover:text-lime-700 font-semibold">
						go back
					</Button>
					to change your email.
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleDetailsSubmit}>
				<CardContent className="space-y-6">
					<div className="grid gap-3">
						<Label
							htmlFor="name"
							className="text-black font-bold text-2xl tracking-wide">
							Name
						</Label>
						<Input
							id="name"
							placeholder="e.g. John Doe"
							required
							{...detailsForm.register("name")}
							className={cn(
								"h-10 text-xl bg-white/30 shadow-inner placeholder:text-black/60 border-2 border-white/40 focus:border-lime-400 focus:placeholder:opacity-0 focus:ring-2 focus:ring-lime-400/20 transition-all duration-300",
								detailsForm.formState.errors.name &&
									"border-red-500 focus-visible:ring-red-500"
							)}
						/>
						{detailsForm.formState.errors.name && (
							<p className="text-red-500 text-sm">
								{detailsForm.formState.errors.name.message}
							</p>
						)}
					</div>
					<div className="grid gap-3">
						<Label
							htmlFor="phone"
							className="text-black font-bold text-2xl tracking-wide">
							Phone Number (Optional)
						</Label>
						<Input
							id="phone"
							placeholder="123-456-7890"
							{...detailsForm.register("phone")}
							className={cn(
								"h-10 text-xl bg-white/30 shadow-inner placeholder:text-black/60 border-2 border-white/40 focus:border-lime-400 focus:placeholder:opacity-0 focus:ring-2 focus:ring-lime-400/20 transition-all duration-300",
								detailsForm.formState.errors.phone &&
									"border-red-500 focus-visible:ring-red-500"
							)}
						/>
						{detailsForm.formState.errors.phone && (
							<p className="text-red-500 text-sm">
								{detailsForm.formState.errors.phone.message}
							</p>
						)}
					</div>
					<div className="grid gap-3">
						<Label
							htmlFor="role"
							className="text-black font-bold text-2xl tracking-wide">
							I am a...
						</Label>
						<Select
							value={detailsForm.watch("role")}
							onValueChange={(value: RoleOption) =>
								detailsForm.setValue("role", value)
							}>
							<SelectTrigger className="h-10 text-xl bg-white/30 border-2 border-white/40 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition-all duration-300">
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								{roleOptions.map((option) => (
									<SelectItem
										key={option}
										value={option}
										className="capitalize">
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-3">
						<Label
							htmlFor="public-action"
							className="text-black font-bold text-2xl tracking-wide">
							Reason for visiting
						</Label>
						<Select
							value={detailsForm.watch("publicAction")}
							onValueChange={(value: PublicAction) =>
								detailsForm.setValue("publicAction", value)
							}
							disabled={intent === "resume"}>
							<SelectTrigger className="h-10 text-xl bg-white/30 border-2 border-white/40 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition-all duration-300">
								<SelectValue placeholder="Select an action" />
							</SelectTrigger>
							<SelectContent>
								{publicActionOptions.map((option) => (
									<SelectItem key={option} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-3">
						<Label
							htmlFor="note"
							className="text-black font-bold text-2xl tracking-wide">
							Private Note to Admin (Optional)
						</Label>
						<Textarea
							id="note"
							placeholder="Send a private note..."
							{...detailsForm.register("note")}
							className="h-32 text-xl bg-white/30 border-2 border-white/40 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition-all duration-300 placeholder:text-black/60"
						/>
					</div>

					<div className="space-y-4 pt-4">
						<Label className="text-2xl font-bold text-black tracking-wide">
							Display my name as:
						</Label>
						<RadioGroup
							defaultValue="full"
							value={detailsForm.watch("displayNamePref")}
							onValueChange={(val: DisplayNamePref) =>
								detailsForm.setValue("displayNamePref", val)
							}
							className="space-y-4">
							<div
								className={`relative p-6 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
									detailsForm.watch("displayNamePref") ===
									"full"
										? "bg-white/40 backdrop-blur-md border-2 border-lime-400 shadow-lg shadow-lime-400/20"
										: "bg-white/20 backdrop-blur-sm border border-white/40 hover:bg-white/30 hover:border-white/50 hover:shadow-md"
								}`}>
								<RadioGroupItem
									value="full"
									id="r1"
									className="sr-only"
								/>
								<Label
									htmlFor="r1"
									className="cursor-pointer w-full">
									<div>
										<span className="text-xl font-bold text-black block">
											Full Name
										</span>
										<span className="text-black/80 block mt-1">
											e.g.,{" "}
											{detailsForm.watch("name") ||
												"John Doe"}
										</span>
									</div>
								</Label>
							</div>
							<div
								className={`relative p-6 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
									detailsForm.watch("displayNamePref") ===
									"initial"
										? "bg-white/40 backdrop-blur-md border-2 border-lime-400 shadow-lg shadow-lime-400/20"
										: "bg-white/20 backdrop-blur-sm border border-white/40 hover:bg-white/30 hover:border-white/50 hover:shadow-md"
								}`}>
								<RadioGroupItem
									value="initial"
									id="r2"
									className="sr-only"
								/>
								<Label
									htmlFor="r2"
									className="cursor-pointer w-full">
									<div>
										<span className="text-xl font-bold text-black block">
											First Name & Last Initial
										</span>
										<span className="text-black/80 block mt-1">
											e.g.,{" "}
											{detailsForm.watch("name")
												? `${
														detailsForm
															.watch("name")
															.split(" ")[0]
												  } ${
														detailsForm
															.watch("name")
															.split(
																" "
															)[1]?.[0] || ""
												  }.`
												: "John D."}
										</span>
									</div>
								</Label>
							</div>
							<div
								className={`relative p-6 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
									detailsForm.watch("displayNamePref") ===
									"anonymous"
										? "bg-white/40 backdrop-blur-md border-2 border-lime-400 shadow-lg shadow-lime-400/20"
										: "bg-white/20 backdrop-blur-sm border border-white/40 hover:bg-white/30 hover:border-white/50 hover:shadow-md"
								}`}>
								<RadioGroupItem
									value="anonymous"
									id="r3"
									className="sr-only"
								/>
								<Label
									htmlFor="r3"
									className="cursor-pointer w-full">
									<div>
										<span className="text-xl font-bold text-black block">
											Anonymous
										</span>
										<span className="text-black/80 block mt-1">
											(Your name will be hidden)
										</span>
									</div>
								</Label>
							</div>
						</RadioGroup>
					</div>
				</CardContent>
				<CardFooter className="flex-col sm:flex-row pt-10 gap-4 w-full">
					<Button
						type="submit"
						className="w-full h-20 text-2xl font-bold bg-gradient-to-r from-lime-500 to-cyan-500 hover:from-lime-600 hover:to-cyan-600 text-white shadow-2xl hover:shadow-3xl hover:shadow-lime-500/30 transition-all duration-300 transform hover:scale-[1.02]"
						disabled={
							createGuest.isPending ||
							!detailsForm.watch("name")?.trim() ||
							!emailForm.watch("email")?.trim()
						}>
						{createGuest.isPending && intent === "guestbook" ? (
							<Loader2 className="mr-3 h-8 w-8 animate-spin" />
						) : (
							"Submit Guest Entry"
						)}
					</Button>
				</CardFooter>
			</form>
		</>
  )
} 