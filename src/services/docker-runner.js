const fs = require("node:fs");
const vm = require("node:vm");

const payload = JSON.parse(fs.readFileSync("/app/payload.json", "utf-8"));

const { sourceCode, functionName, input, expectedOutput } = payload;

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

try {
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(functionName)) {
    throw new Error("Nom de fonction invalide.");
  }

  const args = Array.isArray(input) ? input : [input];

  const scriptCode = `
    ${sourceCode}

    const __userFunction = ${functionName};

    if (typeof __userFunction !== "function") {
      throw new Error('La fonction "${functionName}" est introuvable.');
    }

    __userFunction(...${JSON.stringify(args)});
  `;

  const context = vm.createContext({});

  const script = new vm.Script(scriptCode);

  const actualOutput = script.runInContext(context, {
    timeout: 1000,
  });

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
