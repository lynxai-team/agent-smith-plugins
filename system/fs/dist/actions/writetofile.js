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
import { parsePath, writeToFile } from '../utils.js';

async function action(args, options) {
    const { ok, msg } = parsePath(args, options);
    if (!ok) {
        return msg;
    }
    if (!args?.content) {
        return "[Error]: provide a file content";
    }
    const fp = msg;
    writeToFile(fp, args.content, options?.debug ?? false);
    return `Ok: file ${fp} written`;
}

export { action, writeToFile };