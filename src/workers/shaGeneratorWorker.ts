import { workerData, parentPort } from "worker_threads"
import fse from "fs-extra"
import { createHash } from "crypto"

const { filePath } = workerData

console.log(`💡 Generating SHA256 for ${filePath}...`)

function hashFile(file: string) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256")
    const stream = fse.createReadStream(file)

    stream.on("data", (chunk) => hash.update(chunk))
    stream.on("end", () => resolve(hash.digest("hex")))
    stream.on("error", (err) => reject(err))
  })
}

hashFile(filePath)
  .then((hash) => {
    console.log(`🟢 Finished ${filePath} SHA256 generation!`)
    parentPort?.postMessage({ type: "finished", hash })
  })
  .catch((err) => {
    console.log(`🔴 Error generating SHA256 for ${filePath}!`)
    console.log(err)
    parentPort?.postMessage({ type: "error" })
  })
