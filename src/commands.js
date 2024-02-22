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

    let dependencies = 'vite @vitejs/plugin-react-swc @vitejs/plugin-react vite-tsconfig-paths vite-plugin-svgr';

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


export async function createViteConfig(directory, language, outputDir) {
    let configFilename;
    let plugins;
    let imports;
    if (language === 'ts') {
        configFilename = 'vite.config.ts';
        imports = "import { defineConfig } from 'vite';\n import react from '@vitejs/plugin-react';\n import viteTsconfigPaths from 'vite-tsconfig-paths';"
        plugins = "[react(), viteTsconfigPaths()]"
    } else {
        configFilename = 'vite.config.js'
        imports = "import { defineConfig } from 'vite';\n import react from '@vitejs/plugin-react';"
        plugins = "[react()]"
    }
    const configFilePath = path.join(directory, configFilename);

    const configContent = language === 'js' ? `
            ${imports}
            
            // https://vitejs.dev/config/
            export default defineConfig(() => {
              return {
                build: {
                  outDir: '${outputDir}', // Default output directory for production build
                },
                esbuild: {
                    loader:  { '.js': 'jsx' }, // Tell esbuild to handle .js files as JSX 
                },
                plugins: ${plugins},
              };
            });
            ` :
        `
        ${imports}
        
        // https://vitejs.dev/config/
        export default defineConfig({
            plugins: ${plugins},
            build: {
                outDir: ${outputDir}, // Default output directory for production build
            },
            esbuild: {
                loader:  { '.ts': 'tsx' }, // Tell esbuild to handle .ts files as TSX 
            },
        });
        `

    // for typescript user option
    const tsconfigFilePath = path.join(directory, 'tsconfig.ts')

    const tsconfigContent = `
        {
          "compilerOptions": {
            "target": "ESNext",
            "lib": ["DOM", "DOM.Iterable", "ESNext"],
            "allowJs": true,
            "skipLibCheck": true, 
            "esModuleInterop": true,
            "allowSyntheticDefaultImports": true,
            "strict": true,              
            "forceConsistentCasingInFileNames": true,
            "module": "ESNext",           
            "moduleResolution": "node",  
            "resolveJsonModule": true,   
            "isolatedModules": true,     
            "jsx": "react-jsx"           
          },
          "include": ["src"]            
        }
    `

    try {
        console.log("📄 Generating your Vite configuration...")
        fs.writeFileSync(configFilePath, configContent);
        language === 'ts' ? fs.writeFileSync(tsconfigFilePath, tsconfigContent) : null
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
    try {
        // Reading contents
        const content = fs.readFileSync(srcIndexHtml, {encoding: "utf-8"});
        let updatedContent = content.replace(/%PUBLIC_URL%/g, '');

        // Updating content #TODO more robust parsing might be needed)
        const scriptTagRegex = /<script.*<\/script>/i;
        updatedContent = scriptTagRegex.test(content) ?
            updatedContent = updatedContent.replace(scriptTagRegex,
                (match) => `<noscript>${match}</noscript>` + // Preserve noscript if found
                    `<script type="module" src="/src/${mainFile}"></script>`
            ) :
            updatedContent.replace(/<\/body>/,
                `<script type="module" src="/src/${mainFile}"></script></body>`
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

        // Write the updated package.json
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('Updated package.json scripts successfully!');

    } catch (error) {
        console.error('Error updating package.json:', error);
        throw error
    }
}


