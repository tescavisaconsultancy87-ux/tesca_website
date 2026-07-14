type RuntimeLocals = {
  runtime?: {
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

    const waitUntil = (locals as RuntimeLocals | undefined)?.runtime?.ctx?.waitUntil;
    if (typeof waitUntil === "function") {
      waitUntil(guardedTask);
      return;
    }

    void guardedTask;
  } catch (err) {
    console.error(`[background:${label}] Synchronous error:`, err);
  }
}

