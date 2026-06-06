import { execFile } from "node:child_process";
import path from "node:path";

type RunTestCaseResult = {
  passed: boolean;
  actualOutput: unknown;
  errorMessage: string | null;
  executionTimeMs: number;
};

export function runCodeAgainstTestCase(
  sourceCode: string,
  functionName: string,
  input: unknown,
  expectedOutput: unknown,
): Promise<RunTestCaseResult> {
  const start = Date.now();

  return new Promise((resolve) => {
    const runnerPath = path.join(__dirname, "sandbox-runner.js");

    const payload = JSON.stringify({
      sourceCode,
      functionName,
      input,
      expectedOutput,
    });

    execFile(
      "node",
      [runnerPath, payload],
      {
        timeout: 1500,
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
          const result = JSON.parse(stdout);

          return resolve({
            passed: result.passed,
            actualOutput: result.actualOutput,
            errorMessage: result.errorMessage,
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
}
