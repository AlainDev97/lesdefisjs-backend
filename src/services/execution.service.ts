type RunTestCaseResult = {
  passed: boolean;
  actualOutput: unknown;
  errorMessage: string | null;
  executionTimeMs: number;
};

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function runCodeAgainstTestCase(
  sourceCode: string,
  functionName: string,
  input: unknown,
  expectedOutput: unknown,
): RunTestCaseResult {
  const start = Date.now();

  try {
    const executableCode = `
      ${sourceCode}
      return typeof ${functionName} !== "undefined" ? ${functionName} : null;
    `;

    const getFunction = new Function(executableCode);
    const userFunction = getFunction();

    if (typeof userFunction !== "function") {
      return {
        passed: false,
        actualOutput: null,
        errorMessage: `La fonction "${functionName}" est introuvable dans le code soumis.`,
        executionTimeMs: Date.now() - start,
      };
    }

    const args = Array.isArray(input) ? input : [input];
    const actualOutput = userFunction(...args);
    const passed = deepEqual(actualOutput, expectedOutput);

    return {
      passed,
      actualOutput,
      errorMessage: null,
      executionTimeMs: Date.now() - start,
    };
  } catch (error) {
    return {
      passed: false,
      actualOutput: null,
      errorMessage:
        error instanceof Error
          ? error.message
          : "Erreur inconnue pendant l'exécution",
      executionTimeMs: Date.now() - start,
    };
  }
}
