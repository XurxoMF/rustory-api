import { Worker } from "worker_threads"
import path from "path"

export async function compressWindowsFile(version: string, extractedFolder: string): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const outputPath = "/app/public/versions/windows"
    const outputFileName = `${version}.zip`
    const outFullPath = path.join(outputPath, outputFileName)

    const worker = new Worker(path.resolve(__dirname, "../workers/compressWorker.ts"), {
      workerData: { inputPath: path.join(extractedFolder, "app"), outputPath, outputFileName }
    })

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(outFullPath)
      if (message.type === "error") return resolve(null)
    })

    worker.on("error", (err) => {
      console.log(`🔴 Compress worker error!`)
      console.log(err)
      return resolve(null)
    })

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Compress worker exited with code ${code}!`)
      }
      return resolve(null)
    })
  })
}

export async function compressLinuxFile(version: string, extractedFolder: string): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const outputPath = "/app/public/versions/linux"
    const outputFileName = `${version}.zip`
    const outFullPath = path.join(outputPath, outputFileName)

    const worker = new Worker(path.resolve(__dirname, "../workers/compressWorker.ts"), {
      workerData: { inputPath: path.join(extractedFolder, "vintagestory"), outputPath, outputFileName }
    })

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(outFullPath)
      if (message.type === "error") return resolve(null)
    })

    worker.on("error", (err) => {
      console.log(`🔴 Compress worker error!`)
      console.log(err)
      return resolve(null)
    })

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Compress worker exited with code ${code}!`)
      }
      return resolve(null)
    })
  })
}

export async function compressMacFile(version: string, extractedFolder: string): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const outputPath = "/app/public/versions/macos"
    const outputFileName = `${version}.zip`
    const outFullPath = path.join(outputPath, outputFileName)

    const worker = new Worker(path.resolve(__dirname, "../workers/compressWorker.ts"), {
      workerData: { inputPath: path.join(extractedFolder, "vintagestory.app"), outputPath, outputFileName }
    })

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(outFullPath)
      if (message.type === "error") return resolve(null)
    })

    worker.on("error", (err) => {
      console.log(`🔴 Compress worker error!`)
      console.log(err)
      return resolve(null)
    })

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Compress worker exited with code ${code}!`)
      }
      return resolve(null)
    })
  })
}
