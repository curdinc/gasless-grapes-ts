import { initTRPC } from "@trpc/server";
import { createChromeHandler } from "trpc-chrome/adapter";
import { z } from "zod";

const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true,
});
const publicProcedure = t.procedure;

const appRouter = t.router({
  test: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      console.log("background called");
      return `hello ${input.name}`;
    }),
});
export type AppRouter = typeof appRouter;

createChromeHandler({
  router: appRouter,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});
