let _env: Record<string, string> = {};

export function setRuntimeEnv(env: Record<string, any>) {
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === 'string') {
      _env[key] = value;
    }
  }
}

export function getEnv(key: string): string | undefined {
  // 1. Read from middleware set override (runtime)
  if (_env[key]) {
    return _env[key];
  }
  
  // 2. Fallback to process.env (Node.js/local build time)
  const nodeEnv = (globalThis as any).process?.env as Record<string, string | undefined> | undefined;
  if (nodeEnv?.[key]) {
    return nodeEnv[key];
  }

  // 3. Fallback to import.meta.env
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env as any)[key]) {
      return (import.meta.env as any)[key];
    }
  } catch (e) {}
  
  return undefined;
}
