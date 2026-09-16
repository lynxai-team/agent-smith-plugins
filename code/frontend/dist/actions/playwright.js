/*
# tool
name: playwright
description: "Execute a Playwright Python script"
arguments:
    script:
        description: |-
            The Playwright Python code to execute
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
        image: 'chinayin/playwright:1.52.0-chromium-python3.12',
        workingDir: "/workspace",
        homeDir: "/workspace",
        volumes: [
            { hostPath: location, guestPath: '/workspace' },
        ],
        memoryMib: 2048,
        //network: { "mode": "enabled", allowNet: ["http://localhost:5173"] },
        reuseExisting: true,
        //autoRemove: true,
    });
    process.on('SIGINT', () => box.stop().then(() => process.exit(0)));
    const stdOutBuf = new Array();
    const stdErrBuf = new Array();
    let res = "";
    setTimeout(() => {
        stdErrBuf.push("Timeout: the process has timed out");
        box.stop();
    }, 60000);
    try {
        let cmd = `python3 << 'EOF'\n${args.script}\nEOF`;
        const execution = await box.exec("sh", ["-c", cmd]);
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
    catch (e) {
        console.error(e);
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
