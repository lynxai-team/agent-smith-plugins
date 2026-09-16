async function action(args, options) {
    let final = args.text;
    if (options?.variables?.workspace) {
        final = final.replaceAll(options.variables.workspace, "/workspace",);
    }
    return { text: final };
}

export {
    action,
};