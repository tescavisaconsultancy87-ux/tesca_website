// Runtime env store populated by src/middleware.ts on every request.
//
// On Astro v6 + @astrojs/cloudflare v13, `Astro.locals.runtime.env` was
// removed and replaced by a direct `import { env } from "cloudflare:workers"`.
// The middleware captures the Worker env (from `context.locals.cfContext.env`,
// falling back to the dynamic `import("cloudflare:workers")` namespace) and
// pushes it into this module via `setRuntimeEnv` before any page/API handler
// runs. `getEnv` then reads from that store.
//
// NOTE: `getEnv` stays synchronous by design — handlers call it without
// awaiting. The middleware does the async env loading once per request, so a
// sync lookup here is both correct and ergonomic.

let _env: Record<string, string> = {};

export function setRuntimeEnv(env: Record<string, any> | null | undefined) {
  if (!env) return;
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === 'string') {
      _env[key] = value;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      _env[key] = String(value);
    }
  }
}

export function getEnv(key: string): string | undefined {
  // 1. Runtime env captured from the Cloudflare Worker by middleware (canonical).
  if (_env[key]) {
    return _env[key];
  }

  // 2. process.env (Node.js / local astro dev / build time).
  const nodeEnv = (globalThis as any).process?.env as Record<string, string | undefined> | undefined;
  if (nodeEnv?.[key]) {
    return nodeEnv[key];
  }

  // 3. import.meta.env (Astro build-time inlined PUBLIC_* when an env schema is
  // declared in astro.config / src/env.d.ts). Currently no schema is declared,
  // so this is a best-effort fallback only.
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env as any)[key]) {
      return (import.meta.env as any)[key];
    }
  } catch (e) {}

  return undefined;
}
