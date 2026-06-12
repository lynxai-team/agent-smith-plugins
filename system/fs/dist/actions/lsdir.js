/*
# tool
name: lsdir
description: List files and folders names in a directory
arguments:
    path:
        description: The path of the directory to read
        required: true
*/
import { lsdir } from "../utils.js";
import { parsePath } from '../utils.js';

async function action(args, options) {
    const { ok, msg } = parsePath(args, options);
    if (!ok) {
        return msg;
    }
    return await lsdir(msg, options);
}

export { action };