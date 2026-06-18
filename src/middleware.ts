import { defineMiddleware } from "astro:middleware";
import { setRuntimeEnv } from "./utils/env";

export const onRequest = defineMiddleware((context, next) => {
  const runtime = (context.locals as any).runtime;
  const env = runtime?.env;
  
  if (env) {
    setRuntimeEnv(env);
  }
  
  return next();
});
