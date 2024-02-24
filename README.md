# ⚡ vite-shift: 
### Your Smooth Migration to Vite 🚀

**Effortlessly transition your existing Create React App (CRA) projects to the blazing fast Vite build tool.**

## Why Vite?

* **Lightning-Fast Development:** Vite's near-instant HMR (Hot Module Replacement) and on-demand compilation streamline your workflow.
* **Lean Production Builds:** Vite delivers optimized builds that load at breakneck speeds.
* **Future-Forward:** Embrace the latest frontend technologies without bulky tooling overhead.

## Installation

Install 'vite-shift' globally:

```bash
npm install -g vite-shift
vite-shift
```
## Usage
1. **Navigate:** Change into your CRA project's root directory.
2. **Initiate:** Run the following command:

```bash
vite-shift
```
3. Guide Your Migration: Follow the interactive prompts to tailor the migration process to your project's needs.

## Features

* **Dependency Management:** Uninstalls CRA dependencies and installs essential Vite packages.

* **TypeScript Differentiation:** Generates a tailored Vite configuration (`vite.config.js` or `vite.config.ts`) intelligently matching your project's language.

* **File Conversion:** Renames JavaScript files with .jsx extensions for optimal JSX support.

* **index.html Updates:** Modifies script tags to align with Vite's structure.

* **package.json Refinement:** Adjusts scripts and dependencies for a seamless Vite experience.

* **Optional Vitest Setup:** Streamlines the inclusion of Vitest for robust testing.


## Example: Before and After
### Original `index.html` (CRA)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```
### After Migration with 'vite-shift'
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <script type="module" src="/src/index.jsx"></script> 
  </body>
</html>
```

## Tooling Simplification
##### 'vite-shift' aims to take the hassle out of migrating to Vite. Say goodbye to complex manual configuration. Focus on building, not reconfiguring!

## Contributing
We warmly welcome contributions to make 'vite-shift' even better! To get involved:

1. Check out our contributing guidelines: CONTRIBUTING.md.
2. Explore our open issues.
3. Submit your awesome ideas!

## License

MIT © classicShumba 
