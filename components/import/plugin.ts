// @ts-ignore
import plugin from '../../../../lib/plugins/plugin.js';

type Task = {
    name: string;
    fnc?: any;
    cron?: any;
};

class PluginClass {
    name: string;
    dsc: string;
    event: string;
    priority: number;
    task: Task;
    rule: any;
    e: any;

    async reply(msg?: any, quote?: boolean, data?: any) {};
    constructor(t: any) {};
};

const Plugin = plugin as (typeof PluginClass);

export default Plugin;
