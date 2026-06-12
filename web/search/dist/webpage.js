import TurndownService from 'turndown';
import DOMPurify, { clearWindow } from "isomorphic-dompurify";
import * as cheerio from 'cheerio';

class VisitWebpageTool {
    name = 'visit_webpage';
    description = 'Visits a webpage at the given url and reads its content as a markdown string. Use this to browse webpages.';

    constructor({ timeout = 20_000, maxOutputLength = 40000 } = {}) {
        this.turndownService = new TurndownService();
        this.timeout = timeout;
        this.maxOutputLength = maxOutputLength;
    }

    sanitize(content) {
        const html = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
        clearWindow();
        const $ = cheerio.load(html);
        $('script, style, header, footer, nav, .sidebar, .ad').remove();
        return $.html();
    }

    truncateContent(content, maxLength) {
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + `\n..._This content has been truncated to stay below ${maxLength} characters_...\n`;
    }

    async forward(url) {
        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(this.timeout) });
            if (!response.ok) {
                return `Error fetching the webpage: HTTP ${response.status} ${response.statusText}`;
            }
            const rawhtml = await response.text();
            const html = this.sanitize(rawhtml);
            let markdownContent = this.turndownService.turndown(html).trim();
            markdownContent = markdownContent.replace(/\n{3,}/g, '\n\n');
            return this.truncateContent(markdownContent, this.maxOutputLength);
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('Timeout')) {
                return 'The request timed out. Please try again later or check the URL.';
            }
            if (error instanceof TypeError) {
                return `Error fetching the webpage: ${error.message}`;
            }
            return `An unexpected error occurred: ${error.message}`;
        }
    }
}

export { VisitWebpageTool };
