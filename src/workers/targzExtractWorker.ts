import { parentPort, workerData } from "worker_threads"
import { createReadStream, existsSync, mkdirSync } from "fs"
import { pipeline } from "stream/promises"
import zlib from "zlib"
import * as tar from "tar"

const { filePath, outputPath } = workerData

const extractTarGz = async (inputPath: string, outputPath: string) => {
  const gunzip = zlib.createGunzip()
  const extractStream = tar.extract({ cwd: outputPath })
  await pipeline(createReadStream(inputPath), gunzip, extractStream)
}

const run = async () => {
  try {
    console.log(`💡 Extrayendo ${filePath} en ${outputPath}...`)

    if (!existsSync(outputPath)) {
      mkdirSync(outputPath, { recursive: true })
    }

    await extractTarGz(filePath, outputPath)

    console.log(`🟢 Finished ${filePath} extraction!`)
    parentPort?.postMessage({ type: "finished", outputPath })
  } catch (err) {
    console.log(`🔴 Error extracting ${filePath}!`)
    console.log(err)
    parentPort?.postMessage({ type: "error" })
  }
}

run()
