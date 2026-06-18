import { defineMiddleware } from "astro:middleware";
import { setRuntimeEnv } from "./utils/env";

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const { env } = await import("cloudflare:workers");
    if (env) {
      setRuntimeEnv(env);
    }
  } catch (e) {
    // Fallback/ignore during local development or build time
  }
  
  return next();
});
