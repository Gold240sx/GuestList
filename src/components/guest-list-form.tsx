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

interface GuestListFormProps {
  onGuestAdded: (guest: Guest) => void;
  networkingStatement: string;
}

const roleOptions: RoleOption[] = ["business owner", "recruiter", "developer", "hiring manager", "professional", "friend", "other"];
const publicActionOptions: PublicAction[] = ["Just saying hi!", "Let's connect!"];

export default function GuestListForm({ onGuestAdded, networkingStatement }: GuestListFormProps) {
  const [step, setStep] = useState<"email" | "details">("email");
  const [intent, setIntent] = useState<"guestbook" | "resume">("guestbook");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [role, setRole] = useState<RoleOption>("other");
  const [publicAction, setPublicAction] = useState<PublicAction>("Just saying hi!"); 
  const [displayNamePref, setDisplayNamePref] = useState<DisplayNamePref>("full");
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  
  const { toast } = useToast();
  const utils = api.useUtils();
  const { user, isSignedIn } = useUser();
  
  // Update form when user signs in
  React.useEffect(() => {
    if (isSignedIn && user) {
      setEmail(user.primaryEmailAddress?.emailAddress || "");
      setName(user.fullName || "");
      setProfileImageUrl(user.imageUrl || "");
    }
  }, [isSignedIn, user]);
  
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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep("details");
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setNote('');
    setRole('other');
    setPublicAction('Just saying hi!');
    setDisplayNamePref('full');
    setProfileImageUrl('');
    setStep('email');
    setEmail('');
    setIntent('guestbook');
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalPublicAction = intent === 'resume' ? 'Downloaded the resume' : publicAction;

    createGuest.mutate({
      name,
      phone: phone || undefined,
      email,
      note: note || undefined,
      role,
      publicAction: finalPublicAction,
      displayNamePref,
      profileImageUrl: profileImageUrl || undefined,
    });
  };

  if (step === "email") {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Get In Touch</CardTitle>
          <CardDescription>
            {networkingStatement}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSignedIn && user && (
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
              <SignOutButton>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          )}
          
          {!isSignedIn && (
            <>
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">Quick sign-in with Google to auto-fill your details</p>
                <SignInButton mode="modal" appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-card border border-border shadow-lg",
                    socialButtonsBlockButton: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
                    formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                  },
                }}>
                  <Button variant="outline" className="w-full">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                    Sign in with Google
                  </Button>
                </SignInButton>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue without signing in</span>
                </div>
              </div>
            </>
          )}
          
          <form id="email-form-guestbook" onSubmit={handleEmailSubmit}>
            <Label htmlFor="email" className="sr-only">Email</Label>
            <Input
              id="email-guestbook"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800/50"
            />
          </form>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
          <Button type="submit" form="email-form-guestbook" className="w-full" disabled={!email}>
            <Send className="mr-2"/>
            Sign Guest Book & Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
		<Card className="w-full max-w-lg mx-auto">
			<CardHeader>
				<CardTitle className="text-3xl font-bold">
					Guest Details
				</CardTitle>
				<CardDescription>
					Just a few more details. You can
					<Button
						variant="link"
						onClick={() => setStep("email")}
						className="px-1">
						go back
					</Button>
					to change your email.
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleDetailsSubmit}>
				<CardContent className="space-y-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							placeholder="e.g. John Doe"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="bg-slate-800/50"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="phone">Phone Number (Optional)</Label>
						<Input
							id="phone"
							placeholder="123-456-7890"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							className="bg-slate-800/50"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="role">I am a...</Label>
						<Select
							value={role}
							onValueChange={(value: RoleOption) =>
								setRole(value)
							}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent className="z-10 rounded-2xl border border-slate-700 shadow-2xl">
								{roleOptions.map((option, index) => (
									<SelectItem
										key={option}
										value={option}
										className={cn(
											"capitalize hover:bg-slate-600 transition-colors",
											index % 2 === 0 ? "bg-[#02071b]" : "bg-[#000209]"
										)}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="public-action">
							Reason for visiting
						</Label>
						<Select
							value={publicAction}
							onValueChange={(value: PublicAction) =>
								setPublicAction(value)
							}
							disabled={intent === "resume"}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select an action" />
							</SelectTrigger>
							<SelectContent className="bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl">
								{publicActionOptions.map((option, index) => (
									<SelectItem
										key={option}
										value={option}
										className={cn(
											"hover:bg-slate-700 transition-colors",
											index % 2 === 0 ? "bg-[#02071b]" : "bg-[#000209]"
										)}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="note">
							Private Note to Admin (Optional)
						</Label>
						<Textarea
							id="note"
							placeholder="Send a private note..."
							value={note}
							onChange={(e) => setNote(e.target.value)}
							className="bg-slate-800/50"
						/>
					</div>

					<div className="space-y-4 pt-2">
						<Label className="text-base font-medium">
							Display my name as:
						</Label>
						<RadioGroup
							defaultValue="full"
							value={displayNamePref}
							onValueChange={(val: DisplayNamePref) =>
								setDisplayNamePref(val)
							}
							className="space-y-3 px-6 pb-9">
							<div
								className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
									displayNamePref === "full"
										? "border-primary bg-primary/5"
										: "border-muted bg-muted/30 hover:bg-muted/50"
								}`}>
								<RadioGroupItem
									value="full"
									id="r1"
									className="sr-only"
								/>
								<Label
									htmlFor="r1"
									className="text-base cursor-pointer w-full">
									<span className="font-medium">
										Full Name
									</span>
									<span className="text-muted-foreground block text-sm">
										e.g., John Doe
									</span>
								</Label>
							</div>
							<div
								className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
									displayNamePref === "initial"
										? "border-primary bg-primary/5"
										: "border-muted bg-muted/30 hover:bg-muted/50"
								}`}>
								<RadioGroupItem
									value="initial"
									id="r2"
									className="sr-only"
								/>
								<Label
									htmlFor="r2"
									className="text-base cursor-pointer w-full">
									<span className="font-medium">
										First Name & Last Initial
									</span>
									<span className="text-muted-foreground block text-sm">
										e.g., John D.
									</span>
								</Label>
							</div>
							<div
								className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
									displayNamePref === "anonymous"
										? "border-primary bg-primary/5"
										: "border-muted bg-muted/30 hover:bg-muted/50"
								}`}>
								<RadioGroupItem
									value="anonymous"
									id="r3"
									className="sr-only"
								/>
								<Label
									htmlFor="r3"
									className="text-base cursor-pointer w-full">
									<span className="font-medium">
										Anonymous
									</span>
									<span className="text-muted-foreground block text-sm">
										Your name will be hidden
									</span>
								</Label>
							</div>
						</RadioGroup>
					</div>
				</CardContent>
				<CardFooter className="flex-col sm:flex-row gap-2 w-full">
					<Button
						type="submit"
						className="w-full sm:w-auto"
						disabled={
							createGuest.isPending ||
							!name.trim() ||
							!email.trim()
						}
						onClick={() => setIntent("guestbook")}>
						{createGuest.isPending && intent === "guestbook" ? (
							<Loader2 className="mr-2 animate-spin" />
						) : (
							"Submit"
						)}
					</Button>
				</CardFooter>
			</form>
		</Card>
  )
} 