// @ts-nocheck

const fs = require("node:fs");
const vm = require("node:vm");

const payload = JSON.parse(fs.readFileSync("/app/payload.json", "utf-8"));

const { sourceCode, functionName, testCases } = payload;

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function getErrorMessage(error) {
  if (error && typeof error.message === "string") {
    return error.message;
  }

  return String(error);
}

const results = [];

try {
  const context = {
    console: {
      log: () => {},
      error: () => {},
      warn: () => {},
    },
  };

  vm.createContext(context);

  vm.runInContext(sourceCode, context, {
    timeout: 1000,
  });

  const userFunction = vm.runInContext(functionName, context, {
    timeout: 1000,
  });

  if (typeof userFunction !== "function") {
    throw new Error(`La fonction "${functionName}" est introuvable.`);
  }

  for (const testCase of testCases) {
    const start = Date.now();

    try {
      const args = Array.isArray(testCase.input)
        ? testCase.input
        : [testCase.input];

      context.__args = args;

      const actualOutput = vm.runInContext(
        `${functionName}(...__args)`,
        context,
        {
          timeout: 1000,
        },
      );

      results.push({
        testCaseId: testCase.testCaseId,
        passed: deepEqual(actualOutput, testCase.expectedOutput),
        actualOutput,
        errorMessage: null,
        executionTimeMs: Math.max(Date.now() - start, 1),
      });
    } catch (error) {
      results.push({
        testCaseId: testCase.testCaseId,
        passed: false,
        actualOutput: null,
        errorMessage: getErrorMessage(error),
        executionTimeMs: Math.max(Date.now() - start, 1),
      });
    }
  }

  console.log(JSON.stringify({ results }));
} catch (error) {
  console.log(
    JSON.stringify({
      results: testCases.map((testCase) => ({
        testCaseId: testCase.testCaseId,
        passed: false,
        actualOutput: null,
        errorMessage: getErrorMessage(error),
        executionTimeMs: 0,
      })),
    }),
  );
}
