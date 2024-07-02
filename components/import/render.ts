// @ts-ignore
import puppeteer from '../../../../lib/puppeteer/puppeteer.js';

type Data = { tplFile: string; };

const Render = {
    async render(name: string, data: Data): Promise<string> {
        return puppeteer.screenshot(name, data);
    }
};

export default Render;
