const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const OUTPUT_NAME = 'output.txt';

const dirname = process.argv[2];

Promise.resolve()
    .then(() => readFiles(dirname))
    .then(filePaths => encodeFilePaths(filePaths))
    .then(encodedFilePaths => saveToFile(encodedFilePaths))
    .then(() => openFileList())


function readFiles(dirname) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirname, function (err, filenames) {
            if (err) {
                reject(err);
            }
            resolve(filenames);
        });
    })
}

function encodeFilePaths(filePaths) {
    return Promise.resolve()
    .then(() => filePaths.map(filePath => {
        const fullFilePath = path.join(dirname, filePath);
        return encodeURI(fullFilePath);
    }))
}

function saveToFile(encodeFilePaths) {
    const fileContent = encodeFilePaths.join('\r\n');
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, OUTPUT_NAME), fileContent, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    })  
}

function getCommandLine() {
    switch (process.platform) {
        case 'darwin': return 'open';
        case 'win32': return 'start';
        case 'win64': return 'start';
        default: return 'xdg-open';
    }
}

function openFileList() {
    const commandLine = getCommandLine();
    exec(`${commandLine} ${OUTPUT_NAME}`);
}

