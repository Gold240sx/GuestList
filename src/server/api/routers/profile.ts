import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { profile } from "@/server/db/schema";

const profileInputSchema = z.object({
  name: z.string().min(1),
  aboutMe: z.string().min(1),
  networkingStatement: z.string().min(1),
  profilePictureUrl: z.string().url(),
  appIconUrl: z.string().optional(),
  linkedinUrl: z.string().optional().transform(val => {
    if (!val) return undefined;
    return val.startsWith('http') ? val : `https://${val}`;
  }),
  githubUrl: z.string().optional().transform(val => {
    if (!val) return undefined;
    return val.startsWith('http') ? val : `https://${val}`;
  }),
  buyMeACoffeeUrl: z.string().optional().transform(val => {
    if (!val) return undefined;
    return val.startsWith('http') ? val : `https://${val}`;
  }),
  portfolioUrl: z.string().optional().transform(val => {
    if (!val) return undefined;
    return val.startsWith('http') ? val : `https://${val}`;
  }),
  resumeUrl: z.string().optional(),
  notificationEmail: z.string().email(),
});

export const profileRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    // Get the first (and should be only) profile
    const profileData = await ctx.db.query.profile.findFirst();
    
    if (!profileData) {
      // Create default profile if none exists
      const defaultProfile = {
        name: "Admin",
        aboutMe: "I'm a passionate developer building cool things. Connect with me!",
        networkingStatement: "One of my main goals is to network with other professionals. If you are hiring or know someone who is, please feel free to connect, stay in touch, or download my resume.",
        profilePictureUrl: "https://placehold.co/400x400.png",
        appIconUrl: "https://placehold.co/32x32.png",
        linkedinUrl: null,
        githubUrl: null,
        buyMeACoffeeUrl: null,
        portfolioUrl: null,
        resumeUrl: "/resume.pdf",
        notificationEmail: "admin@example.com"
      };

      const [newProfile] = await ctx.db.insert(profile).values(defaultProfile).returning();
      return newProfile;
    }

    return profileData;
  }),

  update: publicProcedure
    .input(profileInputSchema)
    .mutation(async ({ ctx, input }) => {
      const existingProfile = await ctx.db.query.profile.findFirst();
      
      if (existingProfile) {
        const [updatedProfile] = await ctx.db.update(profile)
          .set({
            ...input,
            appIconUrl: input.appIconUrl || null,
            linkedinUrl: input.linkedinUrl || null,
            githubUrl: input.githubUrl || null,
            buyMeACoffeeUrl: input.buyMeACoffeeUrl || null,
            portfolioUrl: input.portfolioUrl || null,
            resumeUrl: input.resumeUrl || null,
            updatedAt: new Date(),
          })
          .where(eq(profile.id, existingProfile.id))
          .returning();
        
        return updatedProfile;
      } else {
        // Create new profile if none exists
        const [newProfile] = await ctx.db.insert(profile).values({
          ...input,
          appIconUrl: input.appIconUrl || null,
          linkedinUrl: input.linkedinUrl || null,
          githubUrl: input.githubUrl || null,
          buyMeACoffeeUrl: input.buyMeACoffeeUrl || null,
          portfolioUrl: input.portfolioUrl || null,
          resumeUrl: input.resumeUrl || null,
        }).returning();
        
        return newProfile;
      }
    }),
}); 