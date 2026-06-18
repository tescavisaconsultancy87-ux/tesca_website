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
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  return undefined;
}
