const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const OUTPUT_NAME = 'output.txt';

const requiredPath = process.argv[2];
let isFolder;

Promise.resolve()
    .then(() => checkIsFolder(requiredPath))
    .then(() => isFolder ? readFiles(requiredPath) : readLines(requiredPath))
    .then(filePaths => encodeFilePaths(filePaths))
    .then(encodedFilePaths => saveToFile(encodedFilePaths))
    .then(() => openFileList())
    .catch(err => console.error(err));


function checkIsFolder(path) {
    return new Promise((resolve, reject) => {
        fs.lstat(path, (err, stats) => {
            if (err) {
                reject(err);
            }
            isFolder = stats.isDirectory(); 
            resolve();
        })
    })
}

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

function readLines(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.toString().split(/\r\n|\r|\n/));
        })
    })
}

function encodeFilePaths(filePaths) {
    return Promise.resolve()
    .then(() => filePaths.map(filePath => {
        const fullFilePath = isFolder ? path.join(dirname, filePath) : filePath;
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
