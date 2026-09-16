async function action(args, options) {
    let prompt = args[0];
    if (options?.variables?.workspace) {
        prompt = prompt.replaceAll("/workspace", options.variables.workspace);
    }
    return { prompt: prompt };
}

export {
    action,
};