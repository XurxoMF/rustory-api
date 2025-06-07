import { parentPort, workerData } from "worker_threads"
import archiver from "archiver"
import fse from "fs-extra"
import { join } from "path"

const { inputPath, outputPath, outputFileName } = workerData

console.log(`💡 Compressing ${inputPath} to ${outputFileName} on ${outputPath}...`)

const output = fse.createWriteStream(join(outputPath, outputFileName))
const archive = archiver("zip", { zlib: { level: 9 } })

try {
  if (!fse.existsSync(outputPath)) {
    fse.mkdirSync(outputPath, { recursive: true })
  }

  archive.on("error", (err: any) => {
    console.log(`🔴 Error compressing ${inputPath}!`)
    console.log(err)
    parentPort?.postMessage({ type: "error" })
  })

  output.on("close", () => {
    console.log(`🟢 Finished ${inputPath} comrpession!`)
    parentPort?.postMessage({ type: "finished" })
  })

  archive.pipe(output)

  archive.directory(inputPath, false)

  archive.finalize()
} catch (err) {
  console.log(`🔴 Error compressing ${inputPath}!`)
  console.log(err)
  parentPort?.postMessage({ type: "error" })
}
