import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const f = createUploadthing();

// Simple auth function - you can replace this with your actual auth logic
const auth = (req: Request) => ({ id: "admin" }); // For now, allowing all uploads

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Resume uploader for PDF and Word documents
  resumeUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    "application/msword": {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);
      
      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");
      
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Resume upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      try {
        // Create tRPC context and caller
        const context = await createTRPCContext({ headers: new Headers() });
        const caller = createCaller(context);
        
        // Use the tRPC router to create the resume (this handles isCurrent logic)
        const newResume = await caller.resume.create({
          fileName: file.name,
          fileUrl: file.url,
          fileSize: file.size,
          fileType: file.type || "application/octet-stream",
          uploadThingId: file.key,
        });
        
        console.log("Resume saved to database:", newResume);
        
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { 
          uploadedBy: metadata.userId,
          url: file.url,
          name: file.name,
          size: file.size,
          resumeId: newResume?.id,
        };
      } catch (error) {
        console.error("Error saving resume to database:", error);
        throw new UploadThingError("Failed to save resume data");
      }
    }),

  // Profile picture uploader for PNG, JPG, JPEG files
  profilePictureUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);
      
      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");
      
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Profile picture upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      try {
        // Create tRPC context and caller
        const context = await createTRPCContext({ headers: new Headers() });
        const caller = createCaller(context);
        
        // Get current profile to update it
        const currentProfile = await caller.profile.get();
        
        // Update the profile with the new profile picture URL
        const updatedProfile = await caller.profile.update({
          name: currentProfile?.name || "Admin",
          aboutMe: currentProfile?.aboutMe || "I'm a passionate developer building cool things. Connect with me!",
          networkingStatement: currentProfile?.networkingStatement || "One of my main goals is to network with other professionals. If you are hiring or know someone who is, please feel free to connect, stay in touch, or download my resume.",
          profilePictureUrl: file.url,
          appIconUrl: currentProfile?.appIconUrl || undefined,
          linkedinUrl: currentProfile?.linkedinUrl || undefined,
          githubUrl: currentProfile?.githubUrl || undefined,
          buyMeACoffeeUrl: currentProfile?.buyMeACoffeeUrl || undefined,
          portfolioUrl: currentProfile?.portfolioUrl || undefined,
          resumeUrl: currentProfile?.resumeUrl || undefined,
          notificationEmail: currentProfile?.notificationEmail || "admin@example.com",
        });
        
        console.log("Profile picture updated in profile:", updatedProfile);
        
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { 
          uploadedBy: metadata.userId,
          url: file.url,
          name: file.name,
          size: file.size,
        };
      } catch (error) {
        console.error("Error updating profile picture:", error);
        throw new UploadThingError("Failed to update profile picture");
      }
    }),

  // App icon uploader for PNG, JPG, JPEG, SVG files
  appIconUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);
      
      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");
      
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("App icon upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      try {
        // Create tRPC context and caller
        const context = await createTRPCContext({ headers: new Headers() });
        const caller = createCaller(context);
        
        // Get current app icon to delete it
        const currentProfile = await caller.profile.get();
        if (currentProfile?.appIconUrl) {
          // Delete the old app icon from UploadThing
          // Note: This would require additional UploadThing API calls to delete files
          // For now, we'll just update the profile with the new URL
          console.log("Old app icon URL:", currentProfile.appIconUrl);
        }
        
        // Update the profile with the new app icon URL
        const updatedProfile = await caller.profile.update({
          name: currentProfile?.name || "Admin",
          aboutMe: currentProfile?.aboutMe || "I'm a passionate developer building cool things. Connect with me!",
          networkingStatement: currentProfile?.networkingStatement || "One of my main goals is to network with other professionals. If you are hiring or know someone who is, please feel free to connect, stay in touch, or download my resume.",
          profilePictureUrl: currentProfile?.profilePictureUrl || "https://placehold.co/400x400.png",
          appIconUrl: file.url,
          linkedinUrl: currentProfile?.linkedinUrl || undefined,
          githubUrl: currentProfile?.githubUrl || undefined,
          buyMeACoffeeUrl: currentProfile?.buyMeACoffeeUrl || undefined,
          portfolioUrl: currentProfile?.portfolioUrl || undefined,
          resumeUrl: currentProfile?.resumeUrl || undefined,
          notificationEmail: currentProfile?.notificationEmail || "admin@example.com",
        });
        
        console.log("App icon updated in profile:", updatedProfile);
        
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { 
          uploadedBy: metadata.userId,
          url: file.url,
          name: file.name,
          size: file.size,
        };
      } catch (error) {
        console.error("Error updating app icon:", error);
        throw new UploadThingError("Failed to update app icon");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 