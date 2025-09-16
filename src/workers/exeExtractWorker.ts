import { workerData, parentPort } from "worker_threads";
import fse from "fs-extra";
import { spawn } from "child_process";

const { filePath, outputPath } = workerData;

(() => {
  console.log(`💡 Extracting ${filePath} on ${outputPath}...`);

  if (!fse.existsSync(outputPath)) {
    fse.mkdirSync(outputPath, { recursive: true });
  }

  function linuxToWinePath(linuxPath: string): string {
    // Wine maps / to Z:\
    return linuxPath.replace(/\//g, "\\").replace(/^/, "Z:");
  }

  if (!fse.existsSync(filePath)) {
    console.log(`🔴 Input file does not exist: ${filePath}`);
    return parentPort?.postMessage({ type: "error", message: `Input file not found: ${filePath}` });
  }

  if (!fse.existsSync("/app/libs/innounp.exe")) {
    console.log(`🔴 innounp.exe not found at /app/libs/innounp.exe`);
    return parentPort?.postMessage({ type: "error", message: "innounp.exe not found" });
  }

  const command = "wine";
  const wineFilePath = linuxToWinePath(filePath);

  const args = ["/app/libs/innounp.exe", "-x", wineFilePath];
  console.log(`🚀 Executing: ${command} ${args.join(" ")} in directory: ${outputPath}`);

  // Execute the command but on another working directory (outputPath)
  const child = spawn(command, args, {
    stdio: ["ignore", "pipe", "pipe"],
    cwd: outputPath,
  });

  let stdoutData = "";
  let stderrData = "";

  child.stderr.on("data", (data: Buffer) => {
    const output = data.toString();
    stderrData += output;
    // Filter regular Wine logs
    if (
      !output.includes("winediag:") &&
      !output.includes("fixme:") &&
      !output.includes("err:ole:")
    ) {
      console.error(`stderr: ${output.trim()}`);
    }
  });

  child.on("close", (code: number) => {
    console.log(`🔍 Process exited with code: ${code}`);
    console.log(`📤 stdout: ${stdoutData.trim() || "(no output)"}`);
    console.log(
      `📥 stderr (filtered): ${
        stderrData
          .replace(/.*winediag:.*\n?/g, "")
          .replace(/.*fixme:.*\n?/g, "")
          .replace(/.*err:ole:.*\n?/g, "")
          .trim() || "(no errors)"
      }`
    );

    if (code !== 0) {
      console.log(`🔴 Error extracting ${filePath}!`);
      const errorMessage = stdoutData + stderrData;
      return parentPort?.postMessage({
        type: "error",
        message: errorMessage.trim() || `Process failed with exit code ${code}`,
        code: code,
      });
    }

    // Verify that files where extracted
    const files = fse.readdirSync(outputPath);
    console.log(
      `📁 Files created: ${files.length} (${files.slice(0, 3).join(", ")}${
        files.length > 3 ? "..." : ""
      })`
    );

    if (files.length === 0) {
      console.log(`🔴 No files were extracted to ${outputPath}`);
      return parentPort?.postMessage({
        type: "error",
        message: "No files were extracted (extraction may have failed silently)",
      });
    }

    console.log(`🟢 Finished ${filePath} extraction!`);
    return parentPort?.postMessage({ type: "finished" });
  });
})();
