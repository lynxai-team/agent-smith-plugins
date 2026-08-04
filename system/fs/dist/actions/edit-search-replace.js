/*
# tool
name: edit-search-replace
description: Search and replace strings in a file for fast partial edit
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
import { statSync, renameSync, unlinkSync } from 'fs';
import { randomUUID, createHash } from 'crypto';

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
    if (args.new_content === undefined || args.new_content === null) {
        return "[Error]: provide a new_content argument";
    }
    let fc;
    try {
        const stats = statSync(msg);
        if (stats.isDirectory()) {
            return `[Error]: path is a directory, not a file: "${msg}"`;
        }
        fc = readFile(msg);
    } catch (err) {
        if (err.message.includes("Invalid UTF-8") || err.message.includes("invalid encoding")) {
            return `[Error]: file is not a valid text file (binary or unsupported encoding): "${msg}"`;
        }
        return `[Error]: ${err.message}`;
    }

    // Count occurrences of old_content in the file
    const matches = fc.match(new RegExp(_escapeRegExp(args.old_content), 'g'));
    if (!matches) {
        return `[Error]: old_content not found in file "${msg}"`;
    }

    const nc = _replaceAll(fc, args.old_content, args.new_content);

    // Checksum of original content for race detection
    const beforeHash = createHash('sha256').update(fc).digest('hex');

    // Atomic write: temp file then rename
    const tmpPath = `${msg}.tmp.${randomUUID()}`;
    try {
        writeToFile(tmpPath, nc);

        // Verify original file hasn't changed since we read it
        const currentContent = readFile(msg);
        const afterHash = createHash('sha256').update(currentContent).digest('hex');
        if (afterHash !== beforeHash) {
            unlinkSync(tmpPath);
            return `[Error]: file was modified by another process, edit aborted`;
        }

        renameSync(tmpPath, msg);
    } catch (err) {
        try { unlinkSync(tmpPath); } catch (_) {}
        return `[Error]: ${err.message}`;
    }
    return `Ok: file edited (${matches.length} occurrence(s) replaced)`;
}

export { action };