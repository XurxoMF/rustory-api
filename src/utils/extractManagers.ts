import { Worker } from "worker_threads";
import path from "path";

export async function extractWindowsFile(
  version: string,
  filePath: string,
): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const outputPath = path.join("/app/tmp", `win-${version}`);

    const worker = new Worker(path.resolve(__dirname, "../workers/exeExtractWorker.ts"), {
      workerData: { filePath, outputPath },
    });

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(outputPath);
      if (message.type === "error") return resolve(null);
    });

    worker.on("error", (err) => {
      console.log(`🔴 Extract worker error!`);
      console.log(err);
      return resolve(null);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Extract worker exited with code ${code}!`);
      }
      return resolve(null);
    });
  });
}

export async function extractLinuxFile(version: string, filePath: string): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const outputPath = path.join("/app/tmp", `linux-${version}`);

    const worker = new Worker(path.resolve(__dirname, "../workers/targzExtractWorker.ts"), {
      workerData: { filePath, outputPath },
    });

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(outputPath);
      if (message.type === "error") return resolve(null);
    });

    worker.on("error", (err) => {
      console.log(`🔴 Extract worker error!`);
      console.log(err);
      return resolve(null);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Extract worker exited with code ${code}!`);
      }
      return resolve(null);
    });
  });
}

export async function extractMacX64File(version: string, filePath: string): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const outputPath = path.join("/app/tmp", `macos-${version}-X64`);

    const worker = new Worker(path.resolve(__dirname, "../workers/targzExtractWorker.ts"), {
      workerData: { filePath, outputPath },
    });

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(outputPath);
      if (message.type === "error") return resolve(null);
    });

    worker.on("error", (err) => {
      console.log(`🔴 Extract worker error!`);
      console.log(err);
      return resolve(null);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Extract worker exited with code ${code}!`);
      }
      return resolve(null);
    });
  });
}

export async function extractMacARM64File(
  version: string,
  filePath: string,
): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const outputPath = path.join("/app/tmp", `macos-${version}-ARM64`);

    const worker = new Worker(path.resolve(__dirname, "../workers/targzExtractWorker.ts"), {
      workerData: { filePath, outputPath },
    });

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(outputPath);
      if (message.type === "error") return resolve(null);
    });

    worker.on("error", (err) => {
      console.log(`🔴 Extract worker error!`);
      console.log(err);
      return resolve(null);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Extract worker exited with code ${code}!`);
      }
      return resolve(null);
    });
  });
}
