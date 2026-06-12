/*
# tool
name: read-webpage
description: read a web page
arguments:
    url:
        description: the url of the page to read
        required: true
*/
// @ts-ignore
import { VisitWebpageTool } from "../webpage.js";

async function action(args, options) {
    //console.log("NA", args);
    //console.log("NO", options);
    if (!args?.url) {
        return "[Error] provide an url";
    }
    const tool = new VisitWebpageTool();
    const markdown = await tool.forward(args.url);
    return markdown;
}

export {
    action,
};