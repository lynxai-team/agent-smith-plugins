/*
# tool
name: readfile
description: Read a file's content
arguments:
    path:
        description: The path of the file to read
        required: true
*/
import { readFile, parsePath } from '../utils.js';

async function action(args, options) {
    const { ok, msg } = parsePath(args, options);
    if (!ok) {
        return msg;
    }
    //console.log("READ FILE", msg);
    const content = readFile(msg);
    //console.log("FC", content);
    return content;
}

export { action };