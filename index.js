import fs from 'node:fs';
import { Logger } from '#gc';
const apps = await (async function loadApps() {
    let ret = [];
    const files = fs
        .readdirSync('./plugins/jm-plugin/apps')
        .filter(file => file.endsWith('.js'));
    files.forEach((file) => {
        ret.push(import(`./apps/${file}`));
    });
    ret = await Promise.allSettled(ret);
    let apps = {};
    for (let i in files) {
        let name = files[i].replace('.js', '');
        if (ret[i].status != 'fulfilled') {
            Logger.error(`[jm-plugin]：Failed to load ${name}`);
            Logger.error(ret[i].reason);
            continue;
        }
        apps[name] = ret[i].value[Object.keys(ret[i].value)[0]];
    }
    return apps;
})();
export { apps };
