/*
# tool
name: read-document
description: Read a local or remote document for non directly readable documents, like pdf or .docx
arguments:
    path:
        description: The path or uri of the file to read
        required: true
*/
import { extract } from "@xberg-io/xberg";
import { parsePath } from "../utils.js";

async function action(args, options) {
    try {
        const { ok, msg } = parsePath(args, options);
        if (!ok) {
            return msg;
        }
        const output = await extract({
            kind: "uri",
            uri: msg,
        });
        return output.results[0].content;
    } catch (e) {
        console.error(e);
        return "error reading the document";
    }
}

export { action };