import fs from "fs";
import path from "path";
import { exec } from "child_process";

/**
 * Creates a new folder with a .ts file containing a base script template.
 * 
 * Open the created file in VS Code.
 * @param {string} scriptName - The name of the script to create. it will be used for both the folder and the file.
 * 
 */

function createScript(scriptName) {
  if (!scriptName) {
    throw new Error("❌ Please provide a script name as an argument. Example: npm run create-script myScript");
  }

  const scriptDir = path.join("src", scriptName);
  const tsFilePath = path.join(scriptDir, `${scriptName}.ts`);
  const absoluteTsFilePath = path.resolve(tsFilePath);

  if (!fs.existsSync(scriptDir)) {
    fs.mkdirSync(scriptDir, { recursive: true });
    console.log(`📁 Folder created: ${scriptDir}`);
  } else {
    throw new Error(`⚠️  Folder ${scriptDir} already exists`);
  }

  const tsFileTemplate = `(async function handler() {
  //@ts-ignore
  const scriptName = GM_info.script.name;
  //@ts-ignore
  const scriptVersion = GM_info.script.version;

  function displayConsoleColoredMessage(message: string, color: string) {
    return console.info(\`%c\${scriptName} :%c \${message}\`, \`color: \${color}; font-weight:bold;\`, "color: '';",);
  }

  

  displayConsoleColoredMessage(\`Script loaded (v\${scriptVersion})\`, "#db8d45");
})();
`;

  if (!fs.existsSync(absoluteTsFilePath)) {
    fs.writeFileSync(absoluteTsFilePath, tsFileTemplate);
    console.log(`📄 File created: ${tsFilePath}`);
  } else {
    throw new Error(`⚠️  File ${tsFilePath} already exists`);
  }

  const LINE_TO_FOCUS = 11;
  const COLUMN_TO_FOCUS = 4;
  const command = `code -r -g "${absoluteTsFilePath}:${LINE_TO_FOCUS}:${COLUMN_TO_FOCUS}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.warn(`⚠️  Impossible to open VS Code automatically. Open manually: ${absoluteTsFilePath}`);
      return;
    }
    if (stderr) {
      throw new Error(`⚠️  VS Code CLI returned an error:\n${stderr}`);
    }
    console.log(`🚀 File opened in VS Code at line ${LINE_TO_FOCUS} and column ${COLUMN_TO_FOCUS}`);
  });

  console.log(`✅ Script "${scriptName}" created successfully!`);
}

const scriptName = process.argv[2];
createScript(scriptName);
