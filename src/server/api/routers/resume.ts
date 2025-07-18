import { z } from "zod";
import { desc, eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { resumes } from "@/server/db/schema";

const resumeInputSchema = z.object({
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  fileSize: z.number().positive(),
  fileType: z.string().min(1),
  uploadThingId: z.string().min(1),
});

export const resumeRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allResumes = await ctx.db.query.resumes.findMany({
      orderBy: [desc(resumes.createdAt)],
    });
    return allResumes || [];
  }),

  getCurrent: publicProcedure.query(async ({ ctx }) => {
    const currentResume = await ctx.db.query.resumes.findFirst({
      where: eq(resumes.isCurrent, true),
    });
    return currentResume || null;
  }),

  create: publicProcedure
    .input(resumeInputSchema)
    .mutation(async ({ ctx, input }) => {
      // First, deactivate all existing resumes
      await ctx.db.update(resumes)
        .set({ isCurrent: false })
        .where(eq(resumes.isCurrent, true));

      // Then create the new resume as current
      const [newResume] = await ctx.db.insert(resumes).values({
        ...input,
        isCurrent: true,
      }).returning();

      return newResume;
    }),

  setCurrent: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // First, deactivate all resumes
      await ctx.db.update(resumes)
        .set({ isCurrent: false });

      // Then activate the specified resume
      const [updatedResume] = await ctx.db.update(resumes)
        .set({ isCurrent: true })
        .where(eq(resumes.id, input.id))
        .returning();

      return updatedResume;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if the resume is current before deleting
      const resumeToDelete = await ctx.db.query.resumes.findFirst({
        where: eq(resumes.id, input.id),
      });

      if (!resumeToDelete) {
        throw new Error("Resume not found");
      }

      if (resumeToDelete.isCurrent) {
        throw new Error("Cannot delete the current resume. Please set another resume as current first.");
      }

      await ctx.db.delete(resumes).where(eq(resumes.id, input.id));
      return { success: true };
    }),

  incrementDownloadCount: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [updatedResume] = await ctx.db.update(resumes)
        .set({ 
          downloadCount: sql`${resumes.downloadCount} + 1` 
        })
        .where(eq(resumes.id, input.id))
        .returning();

      return updatedResume;
    }),
}); 