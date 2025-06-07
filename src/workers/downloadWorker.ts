import { workerData, parentPort } from "worker_threads"
import axios from "axios"
import fse from "fs-extra"
import { join } from "path"

const { url, outputPath, fileName } = workerData

const pathToDownload = join(outputPath, fileName)

console.log(`💡 Dowloading ${fileName} on ${outputPath} from ${url}...`)

axios({
  url,
  method: "GET",
  responseType: "stream"
})
  .then(({ data }) => {
    if (!fse.existsSync(outputPath)) {
      fse.mkdirSync(outputPath, { recursive: true })
    }

    const writer = fse.createWriteStream(pathToDownload)

    data.pipe(writer)

    writer.on("finish", () => {
      console.log(`🟢 Finished ${fileName} download!`)
      parentPort?.postMessage({ type: "finished" })
    })

    writer.on("error", (err) => {
      console.log(`🔴 Error writing ${fileName}!`)
      console.log(err)
      parentPort?.postMessage({ type: "error" })
    })
  })
  .catch((err) => {
    console.log(`🔴 Error downloading ${fileName}!`)
    console.log(err)
    parentPort?.postMessage({ type: "error" })
  })
