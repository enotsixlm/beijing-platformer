# 投放日报发送

## 自动任务（Cursor Automations）

配置名：**每日投放日报**  
Cron：`0 2 * * *`（UTC）= 北京时间 10:00  
环境：`environmentPublicId = ed6f44fd-923e-11f1-ba66-0e7d0216e441`  
飞书：automation prompt 内嵌 bot webhook（`msg_type=post`）

说明：Webhook / automation 定义在 Cursor Automations UI，**不在本仓库**。  
普通 Cloud Agent（无该 environment、未注入 `FEISHU_WEBHOOK_URL`）会表现为「没有 webhook / 看不到自动任务」。

## 空数据不发送（强制）

若统计日 TikTok+Meta 合计消耗 **&lt; $1**，或正文标记「暂无消耗 / 没有信息」：

1. **不要**往飞书群发
2. 脚本 exit `0`，打印 `decision: skip`

> 与 automation 原文「MCP 失败仍发完整报告」并存：MCP 失败但另一侧有消耗 → 仍发；**两侧都无消耗** → 跳过。

## 手动重发

```bash
export FEISHU_WEBHOOK_URL='https://open.feishu.cn/open-apis/bot/v2/hook/...'
python3 tools/daily-ad-report/send_daily_report.py /path/to/report.md
```

`DRY_RUN=1` 只打印 payload，不 POST。
