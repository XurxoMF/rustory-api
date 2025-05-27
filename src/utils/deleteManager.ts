import { Worker } from "worker_threads"
import path from "path"

export async function deleteTmpFolder(): Promise<boolean> {
  return await new Promise<boolean>((resolve) => {
    const pathToRemove = "/app/tmp"

    const worker = new Worker(path.resolve(__dirname, "../workers/deleteWorker.ts"), {
      workerData: { pathToRemove }
    })

    worker.on("message", (message) => {
      if (message.type === "finished") return resolve(true)
      if (message.type === "error") return resolve(false)
    })

    worker.on("error", (err) => {
      console.log(`🔴 Compress worker error!`)
      console.log(err)
      return resolve(false)
    })

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(`🔴 Compress worker exited with code ${code}!`)
      }
      return resolve(false)
    })
  })
}
