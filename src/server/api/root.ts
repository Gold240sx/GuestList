import { guestRouter } from "@/server/api/routers/guest";
import { profileRouter } from "@/server/api/routers/profile";
import { resumeRouter } from "@/server/api/routers/resume";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  guest: guestRouter,
  profile: profileRouter,
  resume: resumeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.guest.getAll();
 *       ^? Guest[]
 */
export const createCaller = createCallerFactory(appRouter);
