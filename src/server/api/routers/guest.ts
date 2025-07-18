import { z } from "zod";
import { desc, eq, and } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { guests } from "@/server/db/schema";
import type { DisplayNamePref, RoleOption, PublicAction } from "@/lib/types";

const guestInputSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email(),
  note: z.string().optional(),
  publicAction: z.enum(["Just saying hi!", "Let's connect!", "Downloaded the resume"]),
  role: z.enum(["business owner", "recruiter", "developer", "hiring manager", "professional", "friend", "other"]),
  displayNamePref: z.enum(["full", "initial", "anonymous"]),
  profileImageUrl: z.string().optional(),
});

export const guestRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ includeHidden: z.boolean().default(false) }).optional())
    .query(async ({ ctx, input }) => {
      const allGuests = await ctx.db.query.guests.findMany({
        where: input?.includeHidden ? undefined : eq(guests.hidden, false),
        orderBy: [desc(guests.createdAt)],
      });
      return allGuests || [];
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const guest = await ctx.db.query.guests.findFirst({
        where: eq(guests.id, input.id),
      });
      return guest || null;
    }),

  create: publicProcedure
    .input(guestInputSchema)
    .mutation(async ({ ctx, input }) => {
      const [newGuest] = await ctx.db.insert(guests).values({
        name: input.name,
        phone: input.phone || null,
        email: input.email,
        note: input.note || null,
        publicAction: input.publicAction,
        role: input.role,
        displayNamePref: input.displayNamePref,
        profileImageUrl: input.profileImageUrl || null,
        hidden: false, // Default to visible
      }).returning();

      return newGuest;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(guests).where(eq(guests.id, input.id));
      return { success: true };
    }),

  toggleHidden: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const guest = await ctx.db.query.guests.findFirst({
        where: eq(guests.id, input.id),
      });

      if (!guest) {
        throw new Error("Guest not found");
      }

      const [updatedGuest] = await ctx.db.update(guests)
        .set({ hidden: !guest.hidden })
        .where(eq(guests.id, input.id))
        .returning();

      return updatedGuest;
    }),
}); 