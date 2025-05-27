import { workerData, parentPort } from "worker_threads"
import fse from "fs-extra"
import { spawn } from "child_process"

const { filePath, outputPath } = workerData

console.log(`💡 Extracting ${filePath} on ${outputPath}...`)

if (!fse.existsSync(outputPath)) {
  fse.mkdirSync(outputPath, { recursive: true })
}

const command = "innoextract"
const args = ["-d", outputPath, filePath]

const child = spawn(command, args, { stdio: "pipe" })

child.stderr.on("data", (err: any) => {
  console.log(`🔴 Error extracting ${filePath}!`)
  console.log(err)
  return parentPort?.postMessage({ type: "error" })
})

child.on("close", (code: any) => {
  if (code !== 0) {
    console.log(`🔴 Error extracting ${filePath}!`)
    return parentPort?.postMessage({ type: "error" })
  }

  console.log(`🟢 Finished ${filePath} extraction!`)
  return parentPort?.postMessage({ type: "finished" })
})
