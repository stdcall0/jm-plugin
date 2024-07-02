// @ts-ignore
import puppeteer from '../../../../lib/puppeteer/puppeteer.js';
const Render = {
    async render(name, data) {
        return puppeteer.screenshot(name, data);
    }
};
export default Render;
