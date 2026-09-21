/*
# tool
name: playwright-cli-playbook
description: "Run Playwright cli commands. Load the `playwright-cli` skill to understand the api"
arguments:
    commands:
        description: |-
            "The playwright-cli commands to run: an array of commands. Example: ["open https://playwright.dev --headed", "snapshot"]
        required: true
*/
import { utils } from "@agent-smith/core";
import { parseArgsStringToArgv } from 'string-argv';


async function action(args, options) {
    //console.log("ARGS", args);
    const ar = JSON.parse(args.commands);
    //console.log("CMDS", ar);
    //return "ok";
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
        if (a.startsWith("open")) {
            if (!a.includes("--headed")) {
                return `${a}: please use the --headed flag with the open command so the user can see the operations`;
            }
        }
        vars.push(a);
    });
    console.log("Executing playwright-cli playbook", vars.length, "operations:");
    const endRes = [];
    for (const v of vars) {
        const errBuf = [];
        //console.log("Executing", v);
        const execArgs = parseArgsStringToArgv(v.trim());
        console.log("Executing", execArgs);
        let r = await utils.execute("playwright-cli", execArgs, {
            onStderr: (e) => errBuf.push(e.toString())
        });
        if (errBuf.length > 0) {
            r = "[Error]: " + errBuf.join("\n");
        } else {
            r = `${v}:\n${r}`;
        }
        endRes.push(r.toString().replaceAll(options.variables.workspace, "/workspace"));
    }
    //console.log("RES", res);
    return endRes.join("\n");
}

export {
    action,
};