import { Plugin, Common } from '#gc';

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
                    reg: '^(jm|JM)\d{6}$',
                    fnc: 'jmQuery'
                }
            ]
        });
    }

    async jmQuery() {
        const jmID: string = (this.e.msg as string).toLowerCase();
        if (jmID.length != 8 || jmID.startsWith("jm")) return;

        exec(`python plugins/jm-plugin/jm.py ${jmID}`, { windowsHide: true },
            async (error, stdout, stderr) => {
                if (error) {
                    console.log(`[jm-plugin] Error: ${error}`);
                    await this.e.reply(`发生严重错误。`, true);
                }
                else if (stderr) {
                    console.log(`[jm-plugin] PyError: ${stderr}`);
                    await this.e.reply(`错误：${stderr}`, true);
                }
                else {
                    try {
                        const inf: {
                            name: string,
                            tags: string[],
                            author: string
                        } = JSON.parse(stdout);
                        const msgs = [
                            `标题: ${inf.name}`,
                            `作者: ${inf.author}`,
                            `标签: ${inf.tags.join(', ')}`
                        ];
                        const msg = await Common.makeForwardMsg(this.e, msgs, `${jmID} 查询结果`);
                        await this.e.reply(msg);
                    }
                    catch(e) {
                        await this.e.reply(`错误：${e}`, true);
                    }
                }
            });
    }
};
