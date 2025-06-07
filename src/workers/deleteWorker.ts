import { parentPort, workerData } from "worker_threads"
import fse from "fs-extra"

const { pathToRemove } = workerData

console.log(`💡 Deleting ${pathToRemove}...`)

try {
  if (fse.existsSync(pathToRemove)) {
    fse.removeSync(pathToRemove)
    console.log(`🟢 Finished ${pathToRemove} deletion!`)
    parentPort?.postMessage({ type: "finished" })
  } else {
    console.log(`🟢 No path ${pathToRemove} found!`)
    parentPort?.postMessage({ type: "finished" })
  }
} catch (err) {
  console.log(`🔴 Error deleting ${pathToRemove}!`)
  console.log(err)
  parentPort?.postMessage({ type: "error" })
}
