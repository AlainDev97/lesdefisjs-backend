import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile, copyFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

type TestCasePayload = {
  testCaseId: string;
  input: unknown;
  expectedOutput: unknown;
};

type RunTestCaseResult = {
  testCaseId: string;
  passed: boolean;
  actualOutput: unknown;
  errorMessage: string | null;
  executionTimeMs: number;
};

export async function runCodeAgainstTestCases(
  sourceCode: string,
  functionName: string,
  testCases: TestCasePayload[],
): Promise<RunTestCaseResult[]> {
  const start = Date.now();

  const sandboxBaseContainerDir =
    process.env.SANDBOX_CONTAINER_DIR ?? os.tmpdir();

  const sandboxBaseHostDir =
    process.env.SANDBOX_HOST_DIR ?? sandboxBaseContainerDir;

  const sandboxId = `hexajs-${randomUUID()}`;

  const tempDirContainer = path.join(sandboxBaseContainerDir, sandboxId);
  const tempDirHost = path.join(sandboxBaseHostDir, sandboxId);

  try {
    await mkdir(tempDirContainer, { recursive: true });

    const runnerSourcePath = path.join(__dirname, "docker-runner.js");
    const runnerTargetPath = path.join(tempDirContainer, "runner.js");
    const payloadPath = path.join(tempDirContainer, "payload.json");

    await copyFile(runnerSourcePath, runnerTargetPath);

    await writeFile(
      payloadPath,
      JSON.stringify({
        sourceCode,
        functionName,
        testCases,
      }),
      "utf-8",
    );

    return await new Promise<RunTestCaseResult[]>((resolve) => {
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
          `${tempDirHost}:/app:ro`,
          "node:22-alpine",
          "node",
          "/app/runner.js",
        ],
        {
          timeout: 10000,
          maxBuffer: 1024 * 1024,
          env: {},
        },
        (error, stdout) => {
          const totalExecutionTimeMs = Date.now() - start;

          if (error) {
            return resolve(
              testCases.map((testCase) => ({
                testCaseId: testCase.testCaseId,
                passed: false,
                actualOutput: null,
                errorMessage:
                  error.killed || error.signal === "SIGTERM"
                    ? "Temps d'exécution dépassé."
                    : error.message,
                executionTimeMs: totalExecutionTimeMs,
              })),
            );
          }

          try {
            const parsed = JSON.parse(stdout);

            return resolve(parsed.results);
          } catch {
            return resolve(
              testCases.map((testCase) => ({
                testCaseId: testCase.testCaseId,
                passed: false,
                actualOutput: null,
                errorMessage: "Sortie d'exécution invalide.",
                executionTimeMs: totalExecutionTimeMs,
              })),
            );
          }
        },
      );
    });
  } finally {
    await rm(tempDirContainer, {
      recursive: true,
      force: true,
    });
  }
}
