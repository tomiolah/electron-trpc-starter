import { initTRPC } from "@trpc/server";
import z from "zod";
import { createSubscription } from "./util/create-subscription";

const t = initTRPC.create({ isServer: true });

const greetingSubscription = createSubscription<{ text: string }>("greeting");

export const router = t.router({
  greeting: t.procedure
    .input(z.object({ clientId: z.string(), name: z.string().optional() }))
    .mutation((req) => {
      const { input } = req;

      const clientId = input.clientId;
      const name = input.name ?? "<unknown>";

      greetingSubscription.fire({
        text: `<${clientId}> greeted "${name}"`,
      });
      return { text: `Hello ${name}` as const };
    }),
  subscription: t.procedure.subscription(() => {
    return greetingSubscription.getListener();
  }),
});

export type AppRouter = typeof router;
