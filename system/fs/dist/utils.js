import * as fs from 'fs';
import path from "path";

function parsePath(args, options) {
    // check required args
    const location = options?.variables?.path ?? options?.variables?.workspace;
    if (!location) {
        return { ok: false, msg: "[Error]: missing path or workspace parameter" };
    }
    if (!args?.path) {
        throw new Error(`lsdir parsePath: provide  a dirPath argument`);
    }
    let requestedPath = args.path;
    if (args.path.startsWith("./")) {
        requestedPath = process.cwd() + args.path.slice(2);
    }
    let ok = false;
    let fp;
    //console.log("PPA", args);
    //console.log("PPO", options);
    // check for workspace
    if (options?.variables?.workspace) {
        fp = requestedPath.replace("/workspace", options.variables.workspace);
        ok = true;
    }
    // check for authorized paths if no workspace
    else if (options?.variables?.path) {
        const aps = options.variables.path.split(",");
        for (const ap of aps) {
            const authorizedPath = [".", "./"].includes(ap) ? process.cwd() : ap;
            //console.log("Auth path", authorizedPath);
            if (requestedPath.startsWith(authorizedPath)) {
                fp = requestedPath;
                ok = true;
                break;
            }
        }
    }
    if (!ok) {
        return { ok: false, msg: "[Error]: unauthorized file path" };
    }
    return { ok: true, msg: fp };
}

async function lsdir(args, options) {
    let dirPath = "";
    if (Array.isArray(args)) {
        dirPath = args[0];
    } else {
        if (!typeof args == "string") {
            throw new Error("lsdir: input an array or string as parameter");
        }
        dirPath = args;
    }
    if (options?.debug) {
        console.log("Reading", dirPath);
    }
    let result = { files: [], dirs: [] };
    try {
        const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile() && !options?.dirs) {
                let filePath = path.join(dirPath, file.name);
                if (options?.variables?.workspace) {
                    filePath = filePath.replace(options.variables.workspace, "/workspace");
                }
                result.files.push(filePath);
            } else if (file.isDirectory() && !options?.files) {
                let filePath = path.join(dirPath, file.name);
                if (options?.variables?.workspace) {
                    filePath = filePath.replace(options.variables.workspace, "/workspace");
                }
                result.dirs.push(filePath);
            }
        }
    } catch (err) {
        console.error('Error reading directory:', err);
    }
    if (options?.dirs) {
        result = result.dirs;
    }
    if (options?.files) {
        result = result.files;
    }
    /*if (options?.debug) {
        console.log(result);
    }*/
    return result;
}

function isPathDirectoryOrFile(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.isDirectory();
    } catch (err) {
        console.warn(`Invalid path: ${filePath}`, err);
    }
}

function readFile(fp) {
    try {
        const content = fs.readFileSync(fp, { encoding: 'utf8' });
        return content;
    } catch (error) {
        throw new Error(`Failed to read file: ${error.message}`);
    }
}

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

export {
    isPathDirectoryOrFile,
    lsdir,
    parsePath,
    readFile,
    writeToFile,
};
