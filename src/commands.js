import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';


export async function removeCRA(ProjPath) {
    console.log("Uninstalling react-scripts 🔀🗑")
    try {
        execSync('npm uninstall react-scripts', {
            cwd: ProjPath,
            stdio: 'inherit'
        });
    } catch (error) {
        console.error("Error executing command ❌❌: ")
        throw error
    }
    return console.log("Uninstalling react-scripts completed successfully ✅✅")
}

export async function installViteDependencies(ProjPath, language, installVitest) {
    console.log("📦✨ Fetching the essential Vite packages...");

    let dependencies = 'vite browserslist-to-esbuild @vitejs/plugin-react vite-tsconfig-paths vite-plugin-svgr';

    // TypeScript-specific dependencies
    if (language === 'ts') {
        dependencies += ' typescript @types/react @types/react-dom'; // Add TS types
    }

    try {
        execSync(`npm install ${dependencies}`, {
            cwd: ProjPath,
            stdio: 'inherit'
        });

        console.log('Installation complete!');

    } catch (error) {
        console.error("Error executing command ❌❌: ")
        throw error;
    }

    // vitest installation based on user choice
    if (installVitest) {
        console.log("🧪 Want to include Vitest for supercharged testing?");
        try {
            execSync('npm install --save-dev vitest @vitest/ui', {cwd: ProjPath, stdio: 'inherit'});

            if (language === 'ts') {
                // Install TypeScript-specific dependencies
                execSync('npm install --save-dev typescript', {cwd: ProjPath, stdio: 'inherit'});
            }

            console.log("⚡️✅ Setting up your Vitest environment...");
        } catch (error) {
            console.log("❌ Error setting up your Vitest environment...")
            throw error
        }
    }

    console.log("⚡️✨✨ Installed all dependencies successfully ✨✨⚡️\n");
}

export async function convertFiles(projectRoot, language = 'js') { // Default to JavaScript
    function recursiveFileSearch(dir) {
        const results = [];
        const language = 'js'
        fs.readdirSync(dir).forEach(item => {
            const itemPath = path.join(dir, item);

            if (fs.lstatSync(itemPath).isDirectory()) {
                if (item !== 'node_modules') {
                    results.push(...recursiveFileSearch(itemPath));
                }
            } else if (path.extname(itemPath) === `.${language}`) {
                const endIndex = itemPath.lastIndexOf('.')
                const removeExt = itemPath.slice(0, endIndex)
                if (path.extname(removeExt) === '' ){
                    results.push(itemPath);
                }
            }
        });
        return results;
    }

    const files = recursiveFileSearch(projectRoot);

    files.forEach(filePath => {
        try {
            const newFilePath = filePath.replace(/\.js$/, `.${language}x`);
            fs.renameSync(filePath, newFilePath);  // Use rename for efficiency

            console.log(`Renamed ${filePath} to ${newFilePath}`);
        } catch (error) {
            console.error(`Error renaming ${filePath}:`, error);
        }
    });

    console.log('✅✅ File renaming completed');
}


export async function createViteConfig(directory, language, outputDir, port) {
    let configFilename;
    let plugins;
    let imports;
    
    if (language === 'ts') {
        configFilename = 'vite.config.ts';
        imports = "import { defineConfig } from 'vite';\n import react from '@vitejs/plugin-react';\n import viteTsconfigPaths from 'vite-tsconfig-paths';\n import browserslistToEsbuild from 'browserslist-to-esbuild';"
        plugins = "[react(), viteTsconfigPaths()]"
    } else {
        configFilename = 'vite.config.js'
        imports = "import { defineConfig } from 'vite';\n import react from '@vitejs/plugin-react';\n import viteTsconfigPaths from 'vite-tsconfig-paths';\n import browserslistToEsbuild from 'browserslist-to-esbuild';"
        plugins = "[react(), viteTsconfigPaths()]"
    }
    const configFilePath = path.join(directory, configFilename);
    let server;
    if (port) {
        server = `server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to ${port}
    port: ${port},
},`
    }

    const configContent = language === 'js' ? 
        `${imports}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: ${plugins},
    ${server}
    esbuild: {
        loader:  'jsx', // Tell esbuild to handle .js files as JSX 
    },
    build: {
        // --> ["chrome79", "edge92", "firefox91", "safari13.1"]
        target: browserslistToEsbuild(['>0.2%', 'not dead', 'not op_mini all']),
        outDir: '${outputDir}', // Default output directory for production build
    },
});
            ` : `${imports}
    
// https://vitejs.dev/config/
export default defineConfig({
    plugins: ${plugins},
    ${server}
    esbuild: {
        loader:  'jsx', // Tell esbuild to handle .js files as JSX 
    },
    build: {
        // --> ["chrome79", "edge92", "firefox91", "safari13.1"]
        target: browserslistToEsbuild(['>0.2%', 'not dead', 'not op_mini all']),
        outDir: '${outputDir}', // Default output directory for production build
    },
});`

    // for typescript user option
    const tsconfigFilePath = path.join(directory, 'tsconfig.ts')
    const viteEnvPath = path.join(directory, 'vite-env.d.ts')

    const tsconfigContent =
        `{
  "compilerOptions": {
    "target": "ESNext",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "types": ["vite/client"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}`

    const viteEnvConfigContent = `/// <reference types="vite/client" />`


    try {
        console.log("📄 Generating your Vite configuration...")
        fs.writeFileSync(configFilePath, configContent);
        language === 'ts' ? fs.writeFileSync(tsconfigFilePath, tsconfigContent) : null
        language === 'ts' ? fs.writeFileSync(viteEnvPath, viteEnvConfigContent) : null

        console.log(`✅✅ Created ${configFilename} successfully!`);
    } catch (error) {
        console.error(`Error creating ${configFilename}:`, error);
        throw error
    }
}


// adjusting the index.html
export async function updatingIndexHtml(projectPath, mainFile) {
    console.log("↪️🗂 Updating index.html file ↪️🗂")
    const srcIndexHtml = path.join(projectPath, 'public', 'index.html');
    const destIndexHtml = path.join(projectPath, 'index.html');

    if (mainFile === 'index.js'){
        mainFile = 'index.jsx'
    } else if (mainFile === 'main.js') {
        mainFile = 'main.jsx'
    } else if (mainFile === 'main.ts') {
        mainFile = 'main.jsx'
    } else if (mainFile === 'index.ts') {
        mainFile = 'index.tsx'
    }

    try {
        // Reading contents
        const content = fs.readFileSync(srcIndexHtml, {encoding: "utf-8"});
        let updatedContent = content.replace(/%PUBLIC_URL%/g, '');

        // Updating content # TODO more robust parsing might be needed
        const scriptTagRegex = /(<script.*<\/script>)(?=<\/body>)/i;
        updatedContent = scriptTagRegex.test(content) ?
            updatedContent = updatedContent.replace(scriptTagRegex,
                (match) => `<noscript>${match}</noscript>` + // Preserve noscript if found
                    `<script type="module" src="/src/${mainFile}"></script>`
            ) :
            updatedContent.replace(/<\/body>/,
                `<script type="module" src="/src/${mainFile}"></script>\n</body>`
            );
        // Writing the updated file
        fs.writeFileSync(destIndexHtml, updatedContent);

        console.log('✅✅ Updated index.html scripts successfully!');
    } catch (error) {
        console.error("Error migrating index.html:", error);
        throw error
    }
}


export async function updatePackageJson(projPath, language, installVitest) {
    const packageJsonPath = path.join(projPath, 'package.json');

    try {
        let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, {encoding: 'utf-8'}));

        // Remove CRA scripts
        delete packageJson.scripts.start;
        delete packageJson.scripts.build;
        delete packageJson.scripts.test; // Remove if present

        // Add Vite scripts
        packageJson.scripts.dev = 'vite';
        packageJson.scripts.build = 'vite build';
        packageJson.scripts.preview = 'vite preview';

        // Add Vitest script (conditionally)
        if (installVitest) {
            packageJson.scripts.test = language === 'ts' ? 'vitest' : 'vitest run';
        }

        // fixing CJS Build error for Vite's Node API
        // adding type to module
        packageJson.type = "module";

        // Write the updated package.json
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('Updated package.json scripts successfully!');

    } catch (error) {
        console.error('Error updating package.json:', error);
        throw error
    }
}


