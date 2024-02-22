import {
    confirmMigration,
    confirmVitestInstallation,
    determineLanguage,
    getDirectory,
    getMainReactFile,
    getProjectName
} from "./userInputs.js";
import {
    createViteConfig,
    installViteDependencies,
    removeCRA,
    updatePackageJson,
    updatingIndexHtml
} from "./commands.js";

async function performMigration(options) {
    try {
        if (await confirmMigration()) {
            // 1. Uninstall CRA Dependencies
            await removeCRA(options.directory);

            // 2. Install Vite Dependencies
            await installViteDependencies(options.directory, options.language);

            // 3. Create Vite Configuration
            await createViteConfig(options.directory, options.language);

            // 4 moving index.html
            await updatingIndexHtml(options.directory, options.mainFile)

            // 5. updating package.json
            await updatePackageJson(options.directory, options.language, options.installVitest);
        }
        console.log("🎉🎉 Migration Complete! Your project is ready to rock with Vite!")

    } catch (error) {
        console.error('Migration failed:', error);
    }
}


export async function gatherInputsAndMigrate() {
    const projectName = await getProjectName();
    const directory = await getDirectory();
    const language = await determineLanguage();
    const mainFile = await getMainReactFile();
    const installVitest = await confirmVitestInstallation();

    await performMigration({projectName, language, directory, mainFile, installVitest});
}