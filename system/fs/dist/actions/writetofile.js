/*
# tool
name: writetofile
description: Write to a file
arguments:
    path:
        description: The path of the file to write
        required: true
    content:
        description: The content of the file to write
        required: true
*/
import fs from 'fs';
import path from 'path';
import { parsePath } from '../utils.js';

function writeToFile(filePath, content, isVerbose) {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        throw new Error(`The directory ${dirPath} does not exist`);
    }
    try {
        // Write content to file
        fs.writeFileSync(filePath, content);
        if (isVerbose) {
            console.log(`File ${filePath} written`);
        }
    } catch (e) {
        throw new Error(`writing file ${filePath}, ${e}`);
    }
}

async function action(args, options) {
    let isVerbose = options?.verbose || options?.debug;
    const fp = parsePath(args, options);
    writeToFile(fp, content, isVerbose);
    return `Ok: file ${fp} written`;
}

export { action, writeToFile };