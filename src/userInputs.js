import inquirer from "inquirer";
import path from 'path'

export async function confirmMigration() {
    const answer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you ready to migrate from CRA to Vite?'
        }
    ]);
    return answer.confirm;
}

export async function getProjectName() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Enter the name of your existing project:',
            validate: (input) => input.length > 0 ? true : 'Please enter a valid project name'
        }
    ]);
    return answer.projectName;
}

export async function getDirectory() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'directory',
            message: 'Enter the path to your CRA project (leave blank for current directory):',
            default: '.'  // Default to the current directory ('.'')
        }
    ]);
    // Resolve the provided directory (in case the user provides a relative path)
    const absoluteDirectory = path.resolve(answer.directory || '.');

    return absoluteDirectory;
}

export async function determineLanguage() {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'language',
            message: 'Is your project using JavaScript or TypeScript?',
            choices: [
                {name: 'JavaScript', value: 'js'},
                {name: 'TypeScript', value: 'ts'}
            ]
        }
    ]);
    return answer.language; // Will be either 'js' or 'ts'
}

export async function getMainReactFile() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'mainFile',
            message: 'Enter the name of your main React file (e.g., index.jsx, main.ts):',
            validate: (input) => input.length > 0 ? true : 'Please enter a valid filename'
        }
    ]);
    return answer.mainFile;
}

export async function getUserOutputDirectory() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'outputDir',
            message: 'Enter the desired output directory (default is "build"):',
            default: 'build'
        }
    ]);
    return answer.outputDir;
}

export async function getServerPort() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'serverPort',
            message: 'Enter the desired dev server port (default is "5173"):',
            default: '5173'
        }
    ]);
    return answer.serverPort;
}

// querying whether the user needs test package from vitest
export async function confirmVitestInstallation() {
    const answer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'installVitest',
            message: 'Would you like to install Vitest for setting up testing?',
            default: true // Assuming 'true' is a sensible default
        }
    ]);
    return answer.installVitest;
}

export const userOptions = {
    projectName: null,
    directory: null,
    language: null,
    mainFile: null,
    outputDir: null,
    serverPort: null,
    installVitest: null,
};



export function displaySummary(options) {
    console.log("\n--- Migration Summary ---");
    console.log(`Project Name: ${options.projectName}`);
    console.log(`Project Directory: ${options.directory}`);
    console.log(`Language: ${options.language}`);
    console.log(`Main React File: ${options.mainFile}`);
    console.log(`Desired Output Directory for Production: ${options.outputDir}`);
    console.log(`Desired Dev Server Port: ${options.serverPort}`);
    console.log(`Install Vitest: ${options.installVitest ? 'Yes' : 'No'}\n`);
}

