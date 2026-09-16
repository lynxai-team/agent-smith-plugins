async function action(args, options) {
    //console.log("ARGS", args);
    //console.log("OPTS", options);
    const buf = ["### Urls:"];
    options.urls.split(",").forEach(url => buf.push(`- ${url}`));
    buf.push(`\n\n${options.prompt}`);
    return { prompt: buf.join("\n") };
}

export {
    action,
};