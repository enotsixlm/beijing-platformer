# 投放日报发送

## 空数据不发送（强制）

拉取 TikTok + Meta 后，若统计日合计消耗 **&lt; $1**（可用 `MIN_SPEND_USD` 调整），或正文标记为「暂无消耗 / 无投放数据 / 没有信息」，则：

1. **不要**往飞书群发消息
2. 脚本以 exit `0` 结束，并打印 `decision: skip`
3. 自动化 / Agent 也应直接结束，不要发「今日无数据」占位卡

有数据时才调用 `send_daily_report.py` 发送。

## 发送

```bash
export FEISHU_WEBHOOK_URL='https://open.feishu.cn/open-apis/bot/v2/hook/...'
python3 tools/daily-ad-report/send_daily_report.py /path/to/投放日报-YYYY-MM-DD.md
```

本地干跑：

```bash
DRY_RUN=1 FEISHU_WEBHOOK_URL=https://example.invalid \
  python3 tools/daily-ad-report/send_daily_report.py /opt/cursor/artifacts/投放日报-2026-08-08.md
```
