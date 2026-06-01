/*
# tool
name: readfile
description: Read a file's content
arguments:
    path:
        description: The path of the file to read
        required: true
*/
import fs from 'fs/promises';

async function readFile(fp) {
    try {
        const content = await fs.readFile(fp, { encoding: 'utf8' });
        return content;
    } catch (error) {
        throw new Error(`Failed to read file: ${error.message}`);
    }
}

async function action(args, options) {
    let ok = false;
    //console.log("ARGS", args);
    //console.log("OPTS", options);
    if (!(options?.variables?.path)) {
        throw new Error("provide a path");
    }
    let requestedPath = args.path;
    if (args.path.startsWith("./")) {
        requestedPath = process.cwd() + args.path.slice(2);
    }
    //console.log("RP", requestedPath);
    const aps = options.variables.path.split(",");
    for (const ap of aps) {
        const authorizedPath = [".", "./"].includes(ap) ? process.cwd() : ap;
        //console.log("Auth path", authorizedPath);
        if (requestedPath.includes(authorizedPath)) {
            ok = true;
            break;
        }
    }
    if (!ok) {
        return "unauthorized path " + requestedPath;
    }
    //console.log("RF FP", fp);
    return readFile(requestedPath);
}

export { action, readFile };