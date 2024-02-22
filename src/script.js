// const { exec } = require('child_process');
//
// const command = 'ls -l'; // Replace with your desired command
//
// exec(command, (error, stdout, stderr) => {
//     if (error) {
//         console.error('Error:', error);
//     } else {
//         console.log(stdout);
//     }
// });
//

import { spawn } from 'child_process.js'

const npmInstall = spawn('npm', ['install', 'react']);

npmInstall.stdout.on('data', (data) => {
    console.log(data.toString());
});

npmInstall.stderr.on('data', (data) => {
    console.error(data.toString());
});

npmInstall.on('close', (code) => {
    if (code !== 0) {
        console.error(`npm install process exited with code ${code}`);
    }
});
