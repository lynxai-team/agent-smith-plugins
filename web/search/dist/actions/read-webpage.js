/*
# tool
name: read-webpage
description: read a web page as markdown. Long pages are returned in windows; if the result says characters remain, call again with the given offset to continue.
arguments:
    url:
        description: the url of the page to read
        required: true
    offset:
        description: character position to start reading from (0-based). Only use it when a previous result said characters remain. Default 0.
        type: number
        required: false
    length:
        description: maximum number of characters to return in this call. Default 40000.
        type: number
        required: false
*/
// @ts-ignore
import { VisitWebpageTool } from "../webpage.js";

function parseOffset(value) {
    if (value === undefined || value === "") return { value: 0 };
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0) {
        return { error: `[Error] offset must be a non-negative integer (got "${value}")` };
    }
    return { value: n };
}

function parseLength(value) {
    if (value === undefined || value === "") return { value: undefined };
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) {
        return { error: `[Error] length must be a positive integer (got "${value}")` };
    }
    return { value: n };
}

async function action(args, options) {
    if (!args?.url) {
        return "[Error] provide an url";
    }
    const offset = parseOffset(args.offset);
    if (offset.error) return offset.error;
    const length = parseLength(args.length);
    if (length.error) return length.error;
    const tool = new VisitWebpageTool();
    return await tool.forward(args.url, { offset: offset.value, length: length.value });
}

export { action };
