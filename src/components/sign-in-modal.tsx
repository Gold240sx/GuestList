"use client";

import { SignIn } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In to Download Resume</DialogTitle>
          <DialogDescription>
            Please sign in to access the resume download.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent border-none shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                formFieldInput: "bg-background border border-input",
                footerActionLink: "text-primary hover:text-primary/80",
              },
            }}
            redirectUrl="/dashboard"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 