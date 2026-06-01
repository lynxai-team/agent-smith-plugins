function executeQueries(db, query) {
    if (query.endsWith(";")) {
        query = query.slice(0, -1);
    }
    const statements = query.replace("\n", "").split(";");
    const st = statements.map(sql => db.prepare(sql + ";"));
    const t = db.transaction((data = {}) => {
        let results = [];
        for (const stmt of st) {
            if (stmt.reader) {
                results.push(...stmt.all(data));
            }
            else {
                results.push(stmt.run(data));
            }
        }
        //console.log("Q RES", typeof results, results);
        return results;
    });
    let res = t();
    if (res.length == 1) {
        res = res[0];
    }
    return res ? res : null;
}

export {
    executeQueries,
};