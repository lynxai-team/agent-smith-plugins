/*
# tool
name: db-readquery
description: Execute database read query
arguments:
    query:
        description: The sql query to execute
*/
import DatabaseConstructor from "better-sqlite3";
import { executeQueries } from "../utils.js";

async function action(args, options) {
    //console.log("READ ARGS", args);
    //console.log("READ OPTS", options);
    /*if (!args?.query) {
        throw new Error("db-readquery: provide query argument");
    }*/
    const dbPath = options.variables.dbpath;
    const query = args.text;
    const db = new DatabaseConstructor(dbPath, { fileMustExist: true, readonly: true });
    try {
        if (options?.debug || options?.verbose) {
            console.log("Executing", query);
        }
        const results = executeQueries(db, query);
        if (options?.debug || options?.verbose) {
            console.log("Result:", results);
        }
        return results;
    } finally {
        db.close();
    }
}

export {
    action,
};