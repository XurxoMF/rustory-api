import { Worker } from "worker_threads";
import path from "path";

export async function downloadWindowsFile(version: string, url: string): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const outputPath = "/app/tmp";
    const fileName = `win-${version}.exe`;
    const outFullPath = path.join(outputPath, fileName);

    const worker = new Worker(path.resolve(__dirname, "../workers/downloadWorker.ts"), {
      workerData: { url, outputPath, fileName },
    });

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(outFullPath);
      if (message.type === "error") return resolve(null);
    });

    worker.on("error", (err) => {
      console.log(`🔴 Download worker error!`);
      console.log(err);
      return resolve(null);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Download worker exited with code ${code}!`);
      }
      return resolve(null);
    });
  });
}

export async function downloadLinuxFile(version: string, url: string): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const outputPath = "/app/tmp";
    const fileName = `linux-${version}.tar.gz`;
    const outFullPath = path.join(outputPath, fileName);

    const worker = new Worker(path.resolve(__dirname, "../workers/downloadWorker.ts"), {
      workerData: { url, outputPath, fileName },
    });

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(outFullPath);
      if (message.type === "error") return resolve(null);
    });

    worker.on("error", (err) => {
      console.log(`🔴 Download worker error!`);
      console.log(err);
      return resolve(null);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Download worker exited with code ${code}!`);
      }
      return resolve(null);
    });
  });
}

export async function downloadMacX64File(version: string, url: string): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const outputPath = "/app/tmp";
    const fileName = `macos-${version}-X64.tar.gz`;
    const outFullPath = path.join(outputPath, fileName);

    const worker = new Worker(path.resolve(__dirname, "../workers/downloadWorker.ts"), {
      workerData: { url, outputPath, fileName },
    });

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(outFullPath);
      if (message.type === "error") return resolve(null);
    });

    worker.on("error", (err) => {
      console.log(`🔴 Download worker error!`);
      console.log(err);
      return resolve(null);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Download worker exited with code ${code}!`);
      }
      return resolve(null);
    });
  });
}

export async function downloadMacARM64File(version: string, url: string): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const outputPath = "/app/tmp";
    const fileName = `macos-${version}-ARM64.tar.gz`;
    const outFullPath = path.join(outputPath, fileName);

    const worker = new Worker(path.resolve(__dirname, "../workers/downloadWorker.ts"), {
      workerData: { url, outputPath, fileName },
    });

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(outFullPath);
      if (message.type === "error") return resolve(null);
    });

    worker.on("error", (err) => {
      console.log(`🔴 Download worker error!`);
      console.log(err);
      return resolve(null);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Download worker exited with code ${code}!`);
      }
      return resolve(null);
    });
  });
}
