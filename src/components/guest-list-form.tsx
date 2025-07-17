
"use client";

import { useState } from "react";
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
import { addGuest, notifyResumeDownload, sendResumeToUser } from "@/app/actions";
import { Loader2, FileDown, Send } from "lucide-react";
import type { DisplayNamePref, Guest, RoleOption, PublicAction } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "./ui/textarea";

interface GuestListFormProps {
  onGuestAdded: (guest: Guest) => void;
  networkingStatement: string;
}

const roleOptions: RoleOption[] = ["business owner", "recruiter", "developer", "hiring manager", "professional", "friend", "other"];
const publicActionOptions: PublicAction[] = ["Just saying hi!", "Let's connect!"];

export default function GuestListForm({ onGuestAdded, networkingStatement }: GuestListFormProps) {
  const [step, setStep] = useState<"email" | "details">("email");
  const [intent, setIntent] = useState<"guestbook" | "resume">("guestbook"); // Default to guestbook
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [role, setRole] = useState<RoleOption>("other");
  const [publicAction, setPublicAction] = useState<PublicAction>("Just saying hi!");
  const [displayNamePref, setDisplayNamePref] = useState<DisplayNamePref>("full");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
    setStep('email');
    setEmail('');
    setIntent('guestbook');
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const finalPublicAction = intent === 'resume' ? 'Downloaded the resume' : publicAction;

    const guestData = { name, phone, email, note, role, publicAction: finalPublicAction, displayNamePref, createdAt: new Date() };
    const result = await addGuest(guestData);

    if(result.success && result.data) {
        onGuestAdded(result.data); // Notify parent component

        if (intent === 'resume') {
            await notifyResumeDownload(email);
            await sendResumeToUser(email); // Send resume link to the user
            toast({
                title: "Thank You & Check Your Email!",
                description: "You've been added to the guest list and the resume link has been sent to your email."
            });
             // Trigger download in browser
            window.open("/resume.pdf", "_blank");
        } else {
             toast({
                title: "Thank you!",
                description: "You've been added to the guest list."
            });
        }
        resetForm();

    } else {
        toast({
            variant: "destructive",
            title: "Something went wrong",
            description: result.error
        })
    }
    setIsLoading(false);
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
        <CardContent>
            <form id="email-form-guestbook" onSubmit={handleEmailSubmit}>
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input
                  id="email-guestbook"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
          <CardTitle>Guest Details</CardTitle>
          <CardDescription>
            Just a few more details. You can
            <Button variant="link" onClick={() => setStep('email')} className="px-1">go back</Button>
            to change your email.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleDetailsSubmit}>
            <CardContent className="space-y-4">
                 <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="e.g. John Doe" required value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input id="phone" placeholder="123-456-7890" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="role">I am a...</Label>
                      <Select value={role} onValueChange={(value: RoleOption) => setRole(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roleOptions.map(option => (
                                <SelectItem key={option} value={option} className="capitalize">{option}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="public-action">Reason for visiting</Label>
                      <Select value={publicAction} onValueChange={(value: PublicAction) => setPublicAction(value)} disabled={intent === 'resume'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an action" />
                        </SelectTrigger>
                        <SelectContent>
                            {publicActionOptions.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="note">Private Note to Admin (Optional)</Label>
                    <Textarea id="note" placeholder="Send a private note..." value={note} onChange={(e) => setNote(e.target.value)}/>
                </div>

                <div className="grid gap-2">
                    <Label>Display my name as:</Label>
                    <RadioGroup defaultValue="full" value={displayNamePref} onValueChange={(val: DisplayNamePref) => setDisplayNamePref(val)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="full" id="r1" />
                            <Label htmlFor="r1">Full Name (e.g., John Doe)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="initial" id="r2" />
                            <Label htmlFor="r2">First Name & Last Initial (e.g., John D.)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="anonymous" id="r3" />
                            <Label htmlFor="r3">Anonymous</Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-2">
                 <Button type="submit" className="w-full sm:w-auto" disabled={isLoading} onClick={() => setIntent('guestbook')}>
                    {isLoading && intent === 'guestbook' ? (
                        <Loader2 className="mr-2 animate-spin" />
                    ) : (
                       "Submit"
                    )}
                </Button>
                <Button type="submit" variant="secondary" className="w-full sm:w-auto" disabled={isLoading} onClick={() => setIntent('resume')}>
                    {isLoading && intent === 'resume' ? (
                        <Loader2 className="mr-2 animate-spin" />
                    ) : (
                        <>
                            <FileDown className="mr-2"/>
                            Submit and Download Resume
                        </>
                    )}
                </Button>
            </CardFooter>
        </form>
    </Card>
  );
}
