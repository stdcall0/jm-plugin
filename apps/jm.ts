import { Plugin, Common, Logger } from '#gc';

import { exec } from 'child_process';

export class JMPlugin extends Plugin {
    constructor() {
        super({
            name: 'JMPlugin',
            dsc: 'JM API Integration (jm_plugin)',
            event: 'message',
            priority: '98',
            rule: [
                {
                    reg: '^(jm|JM)\\d+$',
                    fnc: 'jmQuery'
                }
            ]
        });
    }

    async jmQuery() {
        const jmID: string = (this.e.msg as string).toLowerCase();
        if (!jmID.startsWith("jm")) return;

        exec(`python plugins/jm-plugin/python/jm.py ${jmID}`, { windowsHide: true },
            async (error, stdout, stderr) => {
                if (error) {
                    Logger.error(`[jm-plugin] Fatal: ${error}`);
                    await this.e.reply(`调用查询库出错。`, true);
                }
                else if (stderr) {
                    Logger.warn(`[jm-plugin] Error: ${stderr}`);
                    await this.e.reply(`查询失败：${stderr}`, true);
                }
                else {
                    try {
                        const lines = stdout.split('\n');
                        let line = lines[0];
                        for (let i = lines.length - 1; i >= 1; --i)
                            if (lines[i].trim()) {
                                line = lines[i];
                                break;
                            }
                        const inf: {
                            name: string,
                            tags: string[],
                            author: string
                        } = JSON.parse(line);
                        const msgs = [
                            `标题: ${inf.name}`,
                            `作者: ${inf.author}`,
                            `标签: ${inf.tags.join(', ')}`
                        ];
                        const msg = await Common.makeForwardMsg(this.e, msgs, `${jmID} 查询结果`);
                        await this.e.reply(msg);
                    }
                    catch(e) {
                        Logger.warn(`[jm-plugin] Error: ${stdout}`);
                        await this.e.reply(`查询失败：${e}`, true);
                    }
                }
            });
    }
};
