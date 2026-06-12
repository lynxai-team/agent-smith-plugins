/*
# tool
name: edit-search-replace
description: Search and replace strings in a file for fast edit
arguments:
    path:
        description: The path of the file to write
        required: true
    old_content:
        description: The original content to be replaced
        required: true
    new_content:
        description: The new content that will replace old content
        required: true
*/
import { readFile, parsePath, writeToFile } from '../utils.js';

function _escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function _replaceAll(str, find, replace) {
    return str.replace(new RegExp(_escapeRegExp(find), 'g'), replace);
}

async function action(args, options) {
    const { ok, msg } = parsePath(args, options);
    if (!ok) {
        return msg;
    }
    if (!args.old_content) {
        return "[Error]: provide an old_content argument";
    }
    if (!args.new_content) {
        return "[Error]: provide a new_content argument";
    }
    const fc = readFile(msg);
    const nc = _replaceAll(fc, args.old_content, args.new_content);
    writeToFile(msg, nc);
    return `Ok: file ${msg} edited`;
}

export { action };