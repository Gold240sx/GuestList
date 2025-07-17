
import type { Timestamp } from "firebase/firestore";

export type DisplayNamePref = 'full' | 'initial' | 'anonymous';

export type RoleOption = "business owner" | "recruiter" | "developer" | "hiring manager" | "professional" | "friend" | "other";

export type PublicAction = "Just saying hi!" | "Let's connect!" | "Downloaded the resume";

export interface Guest {
  id: string; // Firestore document ID
  name: string;
  phone: string;
  email: string;
  note: string; // This is the private note
  publicAction: PublicAction; // This is for the public feed
  role: RoleOption;
  displayNamePref: DisplayNamePref;
  createdAt: Date;
}

export interface GuestDocument {
  name: string;
  phone: string;
  email: string;
  note: string;
  publicAction: PublicAction;
  role: RoleOption;
  displayNamePref: DisplayNamePref;
  createdAt: Timestamp;
}

export interface ProfileData {
  name: string;
  aboutMe: string;
  networkingStatement: string;
  profilePictureUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  buyMeACoffeeUrl: string;
  portfolioUrl: string;
  resumeUrl: string;
  notificationEmail: string;
}
