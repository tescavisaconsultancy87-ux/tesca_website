export type RuntimeLocals = {
  cfContext?: {
    waitUntil?: (promise: Promise<unknown>) => void;
  };
  runtime?: {
    cfContext?: {
      waitUntil?: (promise: Promise<unknown>) => void;
    };
    ctx?: {
      waitUntil?: (promise: Promise<unknown>) => void;
    };
  };
};

export function runInBackground(
  locals: unknown,
  task: Promise<unknown> | (() => Promise<unknown>),
  label: string
): void {
  try {
    const promise = typeof task === "function" ? task() : task;
    const guardedTask = promise.catch((err) => {
      console.error(`[background:${label}]`, err);
    });

    const loc = locals as any;
    let waitUntil: ((promise: Promise<unknown>) => void) | undefined;
    
    if (loc?.cfContext?.waitUntil) {
      waitUntil = loc.cfContext.waitUntil.bind(loc.cfContext);
    } else if (loc?.runtime?.cfContext?.waitUntil) {
      waitUntil = loc.runtime.cfContext.waitUntil.bind(loc.runtime.cfContext);
    } else {
      try {
        if (loc?.runtime?.ctx?.waitUntil) {
          waitUntil = loc.runtime.ctx.waitUntil.bind(loc.runtime.ctx);
        }
      } catch {
        // Ignore deprecated getter error in Astro v6
      }
    }

    if (typeof waitUntil === "function") {
      waitUntil(guardedTask);
      return;
    }

    void guardedTask;
  } catch (err) {
    console.error(`[background:${label}] Synchronous error:`, err);
  }
}

