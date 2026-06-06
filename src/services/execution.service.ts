import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile, copyFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

type RunTestCaseResult = {
  passed: boolean;
  actualOutput: unknown;
  errorMessage: string | null;
  executionTimeMs: number;
};

export async function runCodeAgainstTestCase(
  sourceCode: string,
  functionName: string,
  input: unknown,
  expectedOutput: unknown,
): Promise<RunTestCaseResult> {
  const start = Date.now();

  const tempDir = path.join(os.tmpdir(), `hexajs-${randomUUID()}`);

  try {
    await mkdir(tempDir, { recursive: true });

    const runnerSourcePath = path.join(
      process.cwd(),
      "src",
      "services",
      "docker-runner.js",
    );

    const runnerTargetPath = path.join(tempDir, "runner.js");
    const payloadPath = path.join(tempDir, "payload.json");

    await copyFile(runnerSourcePath, runnerTargetPath);

    await writeFile(
      payloadPath,
      JSON.stringify({
        sourceCode,
        functionName,
        input,
        expectedOutput,
      }),
      "utf-8",
    );

    const result = await new Promise<RunTestCaseResult>((resolve) => {
      execFile(
        "docker",
        [
          "run",
          "--rm",
          "--network",
          "none",
          "--memory",
          "128m",
          "--cpus",
          "0.5",
          "--pids-limit",
          "64",
          "--read-only",
          "-v",
          `${tempDir}:/app:ro`,
          "node:22-alpine",
          "node",
          "/app/runner.js",
        ],
        {
          timeout: 3000,
          maxBuffer: 1024 * 1024,
          env: {},
        },
        (error, stdout) => {
          const executionTimeMs = Date.now() - start;

          if (error) {
            return resolve({
              passed: false,
              actualOutput: null,
              errorMessage:
                error.killed || error.signal === "SIGTERM"
                  ? "Temps d'exécution dépassé."
                  : error.message,
              executionTimeMs,
            });
          }

          try {
            const parsed = JSON.parse(stdout);

            return resolve({
              passed: parsed.passed,
              actualOutput: parsed.actualOutput,
              errorMessage: parsed.errorMessage,
              executionTimeMs,
            });
          } catch {
            return resolve({
              passed: false,
              actualOutput: null,
              errorMessage: "Sortie d'exécution invalide.",
              executionTimeMs,
            });
          }
        },
      );
    });

    return result;
  } finally {
    await rm(tempDir, {
      recursive: true,
      force: true,
    });
  }
}
