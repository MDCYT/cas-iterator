import tgpu from "typegpu";

type TypeGpuRuntime = {
  root: Awaited<ReturnType<typeof tgpu.init>>;
  pulse: ReturnType<Awaited<ReturnType<typeof tgpu.init>>["~unstable"]["createGuardedComputePipeline"]>;
};

let runtimePromise: Promise<TypeGpuRuntime | null> | null = null;

async function getRuntime(): Promise<TypeGpuRuntime | null> {
  if (runtimePromise) {
    return runtimePromise;
  }

  runtimePromise = (async () => {
    if (typeof navigator === "undefined" || !("gpu" in navigator)) {
      return null;
    }

    try {
      const root = await tgpu.init();
      const pulse = root["~unstable"].createGuardedComputePipeline((threadX: number) => {
        "use gpu";
        const ping = threadX + 1;
        void ping;
      });

      return { root, pulse };
    } catch {
      return null;
    }
  })();

  return runtimePromise;
}

export async function hasTypeGpuSupport(): Promise<boolean> {
  return (await getRuntime()) !== null;
}

export async function runTypeGpuPulse(threads: number): Promise<boolean> {
  const runtime = await getRuntime();
  if (!runtime) {
    return false;
  }

  const safeThreads = Math.max(1, Math.floor(threads));
  runtime.pulse.dispatchThreads(safeThreads);
  return true;
}

export async function destroyTypeGpuRuntime(): Promise<void> {
  const runtime = await getRuntime();
  runtime?.root.destroy();
  runtimePromise = null;
}
