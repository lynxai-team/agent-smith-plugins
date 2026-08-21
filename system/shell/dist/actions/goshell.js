/*
# tool
name: shell
description: "Execute shell commands"
arguments:
    command:
        description: |-
            The shell command to execute
        required: true
parallelCalls: false
*/
import { JsBoxlite } from '@boxlite-ai/boxlite';
async function action(args, options) {
    //console.log("SHELL ARGS", args);
    //console.log("SHELL OPTS", options);
    const location = options?.variables?.path ?? options?.variables?.workspace;
    if (!location) {
        return "[Error]: shell tool missing path or workspace parameter";
    }
    if (options?.debug) {
        console.log('Opening box', location);
    }
    //console.log("Cmd:", cmd, cmdArgs);
    const runtime = JsBoxlite.withDefaultConfig();
    const box = await runtime.create({
        //image: 'golang:1.26',
        image: "cimg/go:1.25-node",
        workingDir: "/workspace",
        volumes: [
            { hostPath: location, guestPath: '/workspace' },
        ],
        //network: { "mode": "disabled" },
        //autoRemove: true,
    });
    //process.on('SIGINT', () => box.stop().then(() => process.exit(0)));
    const stdOutBuf = new Array();
    const stdErrBuf = new Array();
    let res = "";
    setTimeout(() => {
        stdErrBuf.push("Timeout: the process has timed out");
        box.stop();
    }, 60000);
    try {
        const execution = await box.exec("sh", ["-c", args.command]);
        async function readStdout() {
            const stdout = await execution.stdout();
            while (true) {
                const line = await stdout.next();
                if (line === null)
                    break;
                const lt = line.trim();
                console.log(`[stdout] ${lt}`);
                stdOutBuf.push(lt);
            }
        }
        async function readStderr() {
            const stderr = await execution.stderr();
            while (true) {
                const line = await stderr.next();
                if (line === null)
                    break;
                const lt = line.trim();
                console.error(`[stderr] ${lt}`);
                stdErrBuf.push(lt);
            }
        }
        await Promise.all([readStdout(), readStderr()]);
        const result = await execution.wait();
        //console.log("CMD RES", result);
        res = `[Exit code]: ${result.exitCode}\n`;
        if (result?.errorMessage) {
            console.error("ERROR", result.errorMessage);
            stdErrBuf.push(result.errorMessage);
        }
        if (stdOutBuf.length > 0) {
            res += `[Stdout]: ${stdOutBuf.join("\n")}\n`;
        }
        if (stdErrBuf.length > 0) {
            res += `[Stderr]: ${stdErrBuf.join("\n")}\n`;
        }
    }
    finally {
        if (options?.debug) {
            console.log("stopping shell box");
        }
        await box.stop();
    }
    return res;
}
export { action, };
