# 投放日报发送

## 自动任务（Cursor Automations）

**状态（2026-08-13）：已按需求要求停用。**  
请到 UI 关闭开关（本仓库 / Cloud Agent MCP **无法**写 Automations）：  
https://cursor.com/automations/7e86604e-9244-11f1-ba66-0e7d0216e441  
操作：打开页面 → 关掉 **Enabled**（或删除该 Automation）。关闭前仍会按 cron 继续跑。

配置名：**每日投放日报**  
ID：`7e86604e-9244-11f1-ba66-0e7d0216e441`  
Cron：`0 2 * * *`（UTC）= 北京时间 10:00  
环境：`environmentPublicId = ed6f44fd-923e-11f1-ba66-0e7d0216e441`  
飞书：automation prompt 内嵌 bot webhook（`msg_type=post`）

说明：Webhook / automation 定义在 Cursor Automations UI，**不在本仓库**。  
`cursor-cloud` MCP 仅有只读 `get-automation`，没有 disable/delete。  
改日若要恢复：重新 Enabled，并先挂载 `tiktok ads` + `meta ads`，再粘贴下方推荐 Prompt。

### 空报根因（为何停用）

自动化跑在 environment `ed6f44fd-…` 时，MCP 目录里**只有** `cursor-cloud`，**没有** `tiktok ads` 与 `meta ads`，连续发出全 N/A 飞书空报。  
同账号 Desktop / 普通 Cloud Agent 能拉真实数据——问题在**自动化环境未挂载广告 MCP**。

### 若以后重新启用，必须在 Automations UI 做的两件事

1. 给自动化环境挂载并授权：`tiktok ads`、`meta ads`（Pipeboard）
2. 把 prompt 换成下方「推荐 Prompt」（禁止再发 MCP 缺失空报）

## 推荐 Prompt（粘贴到「每日投放日报」）

```
你是投放数据助理。每天定时运行时，汇总「昨天」（Asia/Shanghai 自然日）的 TikTok 与 Facebook/Meta 投放数据，用飞书 post 卡片发送完整版日报。

## 数据源（只读，禁止改广告/预算）
MCP 服务器真实名称（必须用 ListMcpResources / GetMcpTools 发现后再调用）：
1. `tiktok ads`：
   - BV-SHK（advertiser_id: 7563600344626839568）— 主账户，必拉
   - 北京瓦那卡科技有限公司_adv（advertiser_id: 7563935842436366353）— 必须检查；无数据也要写明
2. `meta ads`（亦称 Pipeboard）：
   - Luna Li（act_1734570217786282）

## 发送门禁（优先于「仍发完整报告」）
1. 若 `tiktok ads` 与 `meta ads` **都不在 MCP 目录 / 均不可调用**：
   - **禁止**往飞书发 N/A /「暂无数据」空报
   - 只在会话里说明：环境未挂载广告 MCP，请挂载后重跑
   - 然后结束
2. 若两侧合计真实消耗 < $1：不发飞书
3. 若仅一侧 MCP 失败、另一侧有消耗：该侧写「暂无数据：原因」，仍发完整报告

## 必须拉取的粒度（有则写，无则注明）
### TikTok（每个有权限账户）
A. 账户层 AUCTION_ADVERTISER：spend, impressions, clicks, ctr, cpc, cpm, reach, frequency, conversion, cost_per_conversion, total_landing_page_view, cost_per_landing_page_view, video_play_actions, video_watched_2s, video_views_p25/p50/p75/p100, likes, comments, shares, follows, profile_visits
B. Campaign 层（按 spend 降序，列出全部有消耗计划）：核心指标 + campaign_name
C. Top Ads（按 spend Top 7–10）
D. 地区 country_code 拆分

### Meta
A. 账户层 + Campaign 层 + Ad 层（有消耗的全部列出）
B. spend, impressions, clicks, unique_clicks, ctr, cpc, cpm, reach, frequency
C. actions / cost_per_action_type：messaging_conversation_started_7d、messaging_first_reply、total_messaging_connection、link_click、video_view、post_engagement、comment、post_reaction、post_save、messaging_block 等
D. country 拆分

## 飞书发送
POST 到：https://open.feishu.cn/open-apis/bot/v2/hook/7714f3d2-c29f-4ed6-86d1-ae8b86e48e1d
优先用 msg_type=post（中文），结构必须包含：
1) 标题：投放日报｜YYYY-MM-DD
2) 一、总览对比（TikTok vs Meta vs 合计）
3) 二、TikTok：账户层 → 地区 → Campaign → Top Ads；美国账户单独一句
4) 三、Meta：账户层 → 转化/互动明细 → 地区 → Campaign/Ad
5) 四、结论：3–5 条

数字保留合理精度；币种 USD。发送成功确认 webhook 返回 success；失败重试 1 次。
不要修改任何广告状态或预算。
```

## 空数据 / 空报不发送（强制）

脚本 `send_daily_report.py` 会跳过：

1. TikTok+Meta 合计消耗 **&lt; $1**
2. 正文标记「暂无消耗 / 没有信息 / 无投放数据」
3. **MCP 未挂载 / 全 N/A 占位空报**（今日错误日报形态）

跳过时 exit `0`，打印 `decision: skip`。

## 手动重发

```bash
export FEISHU_WEBHOOK_URL='https://open.feishu.cn/open-apis/bot/v2/hook/...'
REPORT_DATE=2026-08-09 python3 tools/daily-ad-report/send_daily_report.py \
  tools/daily-ad-report/examples/投放日报-2026-08-09.md
```

`DRY_RUN=1` 只打印 payload，不 POST。
