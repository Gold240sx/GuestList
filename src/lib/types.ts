export type DisplayNamePref = 'full' | 'initial' | 'anonymous';

export type RoleOption = "business owner" | "recruiter" | "developer" | "hiring manager" | "professional" | "friend" | "other";

export type PublicAction = "Just saying hi!" | "Let's connect!" | "Downloaded the resume";

export interface Guest {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  note: string | null;
  publicAction: PublicAction;
  role: RoleOption;
  displayNamePref: DisplayNamePref;
  profileImageUrl: string | null;
  hidden: boolean;
  createdAt: Date;
}

export interface ProfileData {
  id: number;
  name: string;
  aboutMe: string;
  networkingStatement: string;
  profilePictureUrl: string;
  appIconUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  buyMeACoffeeUrl: string | null;
  portfolioUrl: string | null;
  resumeUrl: string | null;
  notificationEmail: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ProfileFormData {
  name: string;
  aboutMe: string;
  networkingStatement: string;
  profilePictureUrl: string;
  appIconUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  buyMeACoffeeUrl: string;
  portfolioUrl: string;
  resumeUrl: string;
  notificationEmail: string;
}

export interface Resume {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadThingId: string;
  isCurrent: boolean;
  downloadCount: number;
  createdAt: Date;
} 