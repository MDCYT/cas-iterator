import tgpu from "typegpu";

let cachedSupport: boolean | null = null;

export async function hasTypeGpuSupport(): Promise<boolean> {
  if (cachedSupport !== null) {
    return cachedSupport;
  }

  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    cachedSupport = false;
    return cachedSupport;
  }

  try {
    const root = await tgpu.init();
    const pipeline = root["~unstable"].createGuardedComputePipeline(() => {
      "use gpu";
    });
    pipeline.dispatchThreads();
    root.destroy();
    cachedSupport = true;
  } catch {
    cachedSupport = false;
  }

  return cachedSupport;
}
