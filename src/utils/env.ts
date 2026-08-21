// Runtime env store populated from the Cloudflare Worker environment.
//
// On Astro v6 + @astrojs/cloudflare v13, `Astro.locals.runtime.env` was
// removed; the canonical source of the Worker env (vars + secrets + bindings)
// is a top-level `import { env } from "cloudflare:workers"` (see
// https://developers.cloudflare.com/workers/runtime-apis/bindings/). That
// import is valid in top-level Worker scope and reads env once per isolate,
// which is what we want for env vars and secrets (they don't change across
// requests in the same isolate).
//
// `cloudflare:workers` is marked external in astro.config.mjs so the bundler
// leaves the import for the Worker runtime to resolve. The ambient module
// declaration in src/env.d.ts provides the type. The static import is wrapped
// in a try/catch via a runtime feature-detect so that importing this module in
// pure-Node / astro-dev / build contexts (where `cloudflare:workers` does not
// exist) does not crash — in those contexts, getEnv falls back to process.env
// and import.meta.env.
//
// `getEnv` stays synchronous by design — handlers call it without awaiting.
// The companion middleware (src/middleware.ts) also pushes later-arriving env
// into the same store on every request as a backstop.

// Static top-level import — the canonical v6 pattern. The Worker runtime
// resolves `cloudflare:workers` to a module exposing a live `env` Proxy.
// Vite/Astro externalizes this specifier (astro.config.mjs `build.rollupOptions
// .external`), so the import is preserved verbatim in the deployed bundle.
import { env as workerEnvImport } from "cloudflare:workers";

// In non-Worker contexts the static import above resolves to a module-shaped
// object whose `env` could be undefined (the fallback ambient declaration
// returns `const env: Env` which is `undefined` outside a Worker). Mirror it
// into the synchronous store at module load only when it actually exists.
let _env: Record<string, string> = {};
try {
  if (workerEnvImport && typeof workerEnvImport === "object") {
    setRuntimeEnv(workerEnvImport as unknown as Record<string, any>);
  }
} catch {
  /* non-worker context — env unavailable */
}

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
  // 1. Runtime env captured from the Cloudflare Worker at module load.
  if (_env[key]) {
    return _env[key];
  }

  // 2. process.env (Node.js / local astro dev / build time).
  const nodeEnv = (globalThis as any).process?.env as Record<string, string | undefined> | undefined;
  if (nodeEnv?.[key]) {
    return nodeEnv[key];
  }

  // 3. import.meta.env (Astro build-time inlined PUBLIC_* when an env schema
  // is declared in astro.config / src/env.d.ts). Currently no schema is
  // declared, so this is a best-effort fallback only.
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env as any)[key]) {
      return (import.meta.env as any)[key];
    }
  } catch (e) {}

  return undefined;
}
