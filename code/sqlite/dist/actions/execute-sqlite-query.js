/*
# tool
name: execute-sqlite-query
description: Execute database read query
arguments:
    query:
        description: The sql query to execute
        required: true
    dbpath:
        description: "The path to the database file: an absolute path starting with /workspace."
        required: true
*/
import DatabaseConstructor from "better-sqlite3";
import { executeQueries } from "../utils.js";

async function action(args, options) {
    //console.log("READ ARGS", args);
    //console.log("READ OPTS", options);
    if (!options?.query) {
        const msg = "[Error]: provide a query argument";
        console.error(msg);
        return msg;
    }
    if (!options?.dbpath) {
        const msg = "[Error]: provide a dbpath argument";
        console.error(msg);
        return msg;
    } else if (!options.dbpath.startsWith("/workspace")) {
        const msg = "[Error]: provide an absolute path starting with /workspace for the dbpath argument";
        console.error(msg);
        return msg;
    }
    const dbPath = options.dbpath.replaceAll("/workspace", options.variables.workspace);
    const query = options.query;
    const db = new DatabaseConstructor(dbPath, { fileMustExist: true });
    try {
        if (options?.debug || options?.verbose) {
            console.log("Executing", query);
        }
        const results = executeQueries(db, query);
        if (options?.debug || options?.verbose) {
            console.log("Result:", results);
        }
        return typeof results == "object" ? { text: JSON.stringify(results) } : { text: results.toString() };
    } finally {
        db.close();
    }
}

export {
    action,
};