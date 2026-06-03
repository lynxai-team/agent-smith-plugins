import DatabaseConstructor from "better-sqlite3";

async function action(args, options) {
    //console.log("SCH ARGS", args);
    //console.log("SCH OPTS", options);
    if (args.length < 2) {
        throw new Error("db-getschema: provide a db path and a prompt argument");
    }
    let dbPath = "";
    let prompt = "";
    if (Array.isArray(args)) {
        dbPath = args[0];
        prompt = args[1];
    } else {
        dbPath = options.variables.dbpath;
        prompt = args.prompt;
    }
    const db = new DatabaseConstructor(dbPath, { fileMustExist: true, readonly: true });

    // Get the schema information as SQL CREATE TABLE statements
    const schema = [];

    // Get all table names
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

    for (const table of tables) {
        const tableName = table.name;
        const tableInfo = db.prepare(`PRAGMA table_info(${tableName})`).all();
        const indexes = db.prepare(`SELECT name, sql FROM sqlite_master WHERE type='index' AND tbl_name='${tableName}'`).all();

        // Generate CREATE TABLE statement
        let createTableSQL = `CREATE TABLE ${tableName} (\n`;
        const columns = tableInfo.map(col => {
            let columnDef = `  ${col.name} ${col.type}`;
            if (col.notnull) {
                columnDef += " NOT NULL";
            }
            if (col.dflt_value !== null) {
                columnDef += ` DEFAULT ${col.dflt_value}`;
            }
            if (col.pk) {
                columnDef += " PRIMARY KEY";
            }
            return columnDef;
        });
        createTableSQL += columns.join(",\n");
        createTableSQL += "\n);";

        // Add indexes
        const indexSQL = indexes.map(index => index.sql).join("\n");
        if (tableName != "sqlite_sequence") {
            schema.push({
                tableName,
                createTableSQL,
                indexes: indexSQL
            });
        }
    }

    db.close();

    // Return only the SQL schema string
    let sqlSchema = "";
    for (const table of schema) {
        sqlSchema += table.createTableSQL + "\n\n";
        if (table.indexes) {
            sqlSchema += table.indexes + ";\n\n";
        }
    }
    //options.variables.schema = sqlSchema.trim();
    return { prompt: prompt, schema: sqlSchema.trim() };
}

export {
    action,
};