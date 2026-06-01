/*
# tool
name: lsdir
description: List files and folders names in a directory
arguments:
    dirPath:
        description: The path of the directory to read
        required: true
*/
import { lsdir } from "../utils.js";

async function action(args, options) {
    let ok = false;
    //console.log("ARGS", args);
    //console.log("OPTS", options);
    if (!(options?.variables?.path)) {
        throw new Error("provide a path");
    }
    let requestedPath = args.dirPath;
    if (args.dirPath == "./" || args.dirPath == ".") {
        requestedPath = process.cwd();
    } else if (args.dirPath.startsWith("./")) {
        requestedPath = process.cwd() + "/" + args.dirPath.slice(2);
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
    return await lsdir(requestedPath, options);
}

export { action };