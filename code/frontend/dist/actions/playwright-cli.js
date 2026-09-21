/*
# tool
name: playwright-cli
description: "Run a Playwright cli command. Load the `playwright-cli` skill to understand the api"
arguments:
    command:
        description: |-
            the playwright-cli command line. Example: open https://playwright.dev --headed
        required: true
*/
import { utils } from "@agent-smith/core";
import parseArgsStringToArgv from "string-argv";

async function action(args, options) {
    if (args.command.startsWith("playwright-cli")) {
        args.command = args.command.replace("playwright-cli", "").trim();
    }
    const ar = parseArgsStringToArgv(args.command.replaceAll("\\", ""));
    if (options?.variables?.workspace) {
    } else {
        throw new Error("no workspace var");
    }
    //write only in workspace
    ar.forEach(v => {
        if (v.includes("--filename=")) {
            const p = v.replace("--filename=").trim();
            if (!p.startsWith("/workspace")) {
                return "The filename argument must be a path starting with /workspace";
            }
        }
        if (v.includes("--profile=")) {
            const p = v.replace("--profile=").trim();
            if (!p.startsWith("/workspace")) {
                return "The profile argument must be a path starting with /workspace";
            }
        }
    });
    const vars = [];
    ar.forEach(a => {
        if (a.includes("/workspace")) {
            a = a.replaceAll("/workspace", options.variables.workspace);
        }
        vars.push(a);
    });
    console.log("Executing playwright-cli", vars);
    const res = await utils.execute("playwright-cli", vars);
    if (ar[0] == "screenshot") {
        return "Screenshot saved";
    }
    //console.log("RES", res);
    return res.replaceAll(options.variables.workspace, "/workspace");;
}

export {
    action,
};