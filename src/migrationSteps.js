import inquirer from "inquirer";
import {
    confirmMigration,
    confirmVitestInstallation,
    determineLanguage,
    getDirectory,
    getMainReactFile,
    getUserOutputDirectory,
    getProjectName,
    userOptions,
    displaySummary
} from "./userInputs.js";
import {
    createViteConfig,
    installViteDependencies,
    removeCRA,
    updatePackageJson,
    updatingIndexHtml,
    convertFiles
} from "./commands.js";

async function performMigration(options) {
    try {
        if (await confirmMigration()) {
            // 1. Uninstall CRA Dependencies
            await removeCRA(options.directory);

            // 2. Install Vite Dependencies
            await installViteDependencies(options.directory, options.language);

            // 3. Create Vite Configuration
            await createViteConfig(options.directory, options.language, options.outputDir);

            // 4. renaming js files with jsx in it to use .jsx
            await convertFiles(options.directory, options.language)

            // 5. moving index.html
            await updatingIndexHtml(options.directory, options.mainFile)

            // 6. updating package.json
            await updatePackageJson(options.directory, options.language, options.installVitest);
        }
        console.log("🎉🎉 Migration Complete! Your project is ready to rock with Vite!")

    } catch (error) {
        console.error('Migration failed:', error);
    }
}


export async function gatherInputsAndMigrate() {
    userOptions.projectName = await getProjectName();
    userOptions.directory = await getDirectory();
    userOptions.language = await determineLanguage();
    userOptions.mainFile = await getMainReactFile();
    userOptions.outputDir = await getUserOutputDirectory();
    userOptions.installVitest = await confirmVitestInstallation();

    // displaying user's selected options
    const options = userOptions

    displaySummary(options)

    await performMigration(options)

}