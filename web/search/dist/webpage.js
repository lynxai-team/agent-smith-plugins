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

    async forward(url, { offset = 0, length } = {}) {
        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(this.timeout) });
            if (!response.ok) {
                return `Error fetching the webpage: HTTP ${response.status} ${response.statusText}`;
            }
            const rawhtml = await response.text();
            const html = this.sanitize(rawhtml);
            let markdownContent = this.turndownService.turndown(html).trim();
            markdownContent = markdownContent.replace(/\n{3,}/g, '\n\n');
            // Empty-but-200 pages (e.g. JS-rendered or blocked) previously returned "" which the history builder
            // misread as a pending tool call -> duplicate assistant message. Give actionable feedback instead.
            if (!markdownContent) {
                return `The webpage at ${url} returned no readable content. The page may require JavaScript or blocked the request.`;
            }
            const total = markdownContent.length;
            if (offset >= total) {
                return `Offset ${offset} is beyond the end of the content (${total} characters total); nothing more to read.`;
            }
            const maxLen = length ?? this.maxOutputLength;
            let end = Math.min(total, offset + maxLen);
            // snap back to a newline so chunks don't split mid-line
            if (end < total) {
                const nl = markdownContent.lastIndexOf("\n", end);
                if (nl > offset) end = nl + 1;
            }
            // avoid splitting a surrogate pair at the boundary
            if (end < total && (markdownContent.charCodeAt(end) & 0xfc00) === 0xdc00) {
                end -= 1;
            }
            const chunk = markdownContent.slice(offset, end);
            const remaining = total - end;
            if (remaining > 0) {
                return chunk + `\n\n[read-webpage] returned characters ${offset}-${end} of ${total}. ${remaining} characters remain. To continue, call read-webpage again with the same url and offset=${end}.`;
            }
            return chunk;
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
