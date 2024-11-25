CONFIG = """# 开启jmcomic的日志输入，默认为true
# 对日志有需求的可进一步参考文档
log: true

# 配置客户端相关
client:
  # impl: 客户端实现类，不配置默认会使用JmModuleConfig.DEFAULT_CLIENT_IMPL
  # 可配置:
  #  html - 表示网页端
  #  api - 表示使用APP端（无需cookie）
  impl: api

  # domain: 域名配置，默认是 []，表示运行时自动获取域名。
  # 可配置特定域名，如下(这些域名不一定还能用了，除非确定域名可用否则不要固定)：
  #  - jm-comic.org
  #  - jm-comic2.cc
  #  - 18comic.vip
  #  - 18comic.org
  # 程序会先用第一个域名，如果第一个域名重试n次失败，则换下一个域名重试，以此类推。
  domain: []

  # retry_times: 请求失败重试次数，默认为5
  retry_times: 5

  # postman: 请求配置
  postman:
    meta_data:
      # proxies: 代理配置，默认是 system，表示使用系统代理。
      # 以下的写法都可以:
      # proxies: null # 不使用代理
      # proxies: clash
      # proxies: v2ray
      # proxies: 127.0.0.1:7890
      proxies: null
      # proxies: system

      # cookies: 帐号配置，默认是 null，表示 未登录状态访问JM。
      # 禁漫的大部分本子，下载是不需要登录的；少部分敏感题材需要登录才能看。
      # 如果你希望以登录状态下载本子，最简单的方式是配置一下浏览器的cookies，
      # 不用全部cookies，只要那个叫 AVS 就行。
      # 特别注 意！！！(https://github.com/hect0x7/JMComic-Crawler-Python/issues/104)
      # cookies是区分域名的：
      # 假如你要 访问的是 `18comic.vip`，那么你配置的cookies也要来自于 `18comic.vip`，不能配置来自于 `jm-comic.club` 的cookies。
      # 如果你发现配置了cookies还是没有效果，大概率就是你配置的cookies和代码访问的域名不一致。
      cookies:
        AVS:
      # 缺省值"""

import sys
import re
import json
import jmcomic as jm

try:
    id = sys.argv[1]
    assert(re.match(r"^(jm|JM)\d+$", id))
except:
    print("JM ID Invalid", file=sys.stderr)
    sys.exit()

try:
    client = jm.create_option_by_str(CONFIG).new_jm_client()
except:
    print("Failed to initialize JM client", file=sys.stderr)
    sys.exit()

try:
    data = client.get_album_detail(id)
except Exception as e:
    print(f"Failed to get album detail\n{e}", file=sys.stderr)
    sys.exit()

try:
    print(json.dumps({"name": data.name, "tags": data.tags, "author": data.author}))
    sys.exit()
except Exception as e:
    print(f"Failed to read album detail\n{e}", file=sys.stderr)
    sys.exit()
