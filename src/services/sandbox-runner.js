const { sourceCode, functionName, input, expectedOutput } = JSON.parse(
  process.argv[2],
);

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

try {
  const executableCode = `
    const process = undefined;
    const require = undefined;
    const global = undefined;
    const globalThis = undefined;
    const module = undefined;
    const exports = undefined;

    ${sourceCode}

    return typeof ${functionName} !== "undefined" ? ${functionName} : null;
  `;

  const getFunction = new Function(executableCode);
  const userFunction = getFunction();

  if (typeof userFunction !== "function") {
    throw new Error(`La fonction "${functionName}" est introuvable.`);
  }

  const args = Array.isArray(input) ? input : [input];
  const actualOutput = userFunction(...args);

  console.log(
    JSON.stringify({
      passed: deepEqual(actualOutput, expectedOutput),
      actualOutput,
      errorMessage: null,
    }),
  );
} catch (error) {
  console.log(
    JSON.stringify({
      passed: false,
      actualOutput: null,
      errorMessage: error instanceof Error ? error.message : "Erreur inconnue",
    }),
  );
}
