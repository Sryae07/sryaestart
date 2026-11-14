# Sryaestart 看板直达

固定入口：<https://sryae07.dpdns.org>（GitHub Pages 托管的静态跳板，零第三方依赖）

## 它怎么工作

```
手机/电脑打开 sryae07.dpdns.org
        |
        v
探测固定隧道地址 https://dash.sryae07.dpdns.org   ← Cloudflare 具名隧道，地址永不改变
        |  不通
        v
退回仓库根目录 current-server.json 里的一次性地址   ← 兼容旧的 cloudflared quick tunnel
        |
        v
探测成功（用一张图验证隧道 + 后端都活着）→ 跳到 <地址>/dashboard
探测失败 → 显示「暂时离线」，每 5 秒自动重试
```

页面不存任何账号密码，也不做登录；它只是把你带到那台正在跑 Sryaestart 的电脑上。
电脑关机 = 页面停在离线态，电脑开机后手机不刷新也会自己跳进去。

## 文件

| 文件 | 说明 |
|---|---|
| `index.html` | 入口页（内联样式与脚本，无外部依赖） |
| `icon-192.png` | 图标，兼作隧道探测用的探针资源 |
| `current-server.json` | 旧方案的一次性隧道地址，现在作为兜底 |
| `CNAME` | GitHub Pages 自定义域名 |

## 改固定域名

`index.html` 里 `<script>` 开头有：

```js
var FIXED_BASE = "https://dash.sryae07.dpdns.org";
```

改这里即可；留空字符串就退回「只读 current-server.json」的老行为。

电脑端的隧道配置（cloudflared 具名隧道、开机自启、跑在哪个端口）不在这个仓库里，
见 `Documents/web-projects/_tunnel-sryaestart/README.md`。
