import { Worker } from "worker_threads"
import path from "path"

export async function generateSHA256(filePath: string): Promise<string | null> {
  return await new Promise<string | null>((resolve) => {
    const worker = new Worker(path.resolve(__dirname, "../workers/shaGeneratorWorker.ts"), {
      workerData: { filePath }
    })

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(message.hash)
      if (message.type === "error") return resolve(null)
    })

    worker.on("error", (err) => {
      console.log(`🔴 SHA256 generator worker error!`)
      console.log(err)
      return resolve(null)
    })

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 SHA256 generator worker exited with code ${code}!`)
      }
      return resolve(null)
    })
  })
}
