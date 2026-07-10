type RuntimeLocals = {
  runtime?: {
    ctx?: {
      waitUntil?: (promise: Promise<unknown>) => void;
    };
  };
};

export function runInBackground(
  locals: unknown,
  task: Promise<unknown>,
  label: string
): void {
  const guardedTask = task.catch((err) => {
    console.error(`[background:${label}]`, err);
  });

  const waitUntil = (locals as RuntimeLocals | undefined)?.runtime?.ctx?.waitUntil;
  if (typeof waitUntil === "function") {
    waitUntil(guardedTask);
    return;
  }

  void guardedTask;
}

