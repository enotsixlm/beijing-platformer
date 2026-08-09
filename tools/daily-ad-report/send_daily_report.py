#!/usr/bin/env python3
"""Send 投放日报 to Feishu using msg_type=post (automation format).

Empty-send rule (user override on top of automation prompt):
  If combined TikTok + Meta spend for the report day is below MIN_SPEND_USD,
  do NOT post. Exit 0 with decision=skip.

The Cursor automation 「每日投放日报」 stores the webhook in its prompt and
runs on cron `0 2 * * *` (UTC = 10:00 Asia/Shanghai) with environmentPublicId
ed6f44fd-923e-11f1-ba66-0e7d0216e441. This script is for manual / agent re-send.

Required env:
  FEISHU_WEBHOOK_URL  — Feishu custom bot webhook (do not commit the secret)

Optional:
  MIN_SPEND_USD  — default 1.0
  REPORT_DATE    — YYYY-MM-DD title suffix
  DRY_RUN=1      — print payload only
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path


MIN_SPEND_USD = float(os.environ.get("MIN_SPEND_USD", "1.0"))


def _parse_spend(markdown: str) -> float:
    for line in markdown.splitlines():
        if "合计" in line and "$" in line:
            amounts = re.findall(r"\$([0-9]+(?:\.[0-9]+)?)", line)
            if amounts:
                return float(amounts[0])
    total = 0.0
    for label in ("TikTok", "Meta"):
        m = re.search(
            rf"{label}[^\n]*?\$([0-9]+(?:\.[0-9]+)?)",
            markdown,
            re.IGNORECASE,
        )
        if m:
            total += float(m.group(1))
    return total


def should_send(text: str) -> tuple[bool, str, float]:
    stripped = text.strip()
    if not stripped:
        return False, "empty body", 0.0
    spend = _parse_spend(stripped)
    markers = ("暂无消耗", "无投放数据", "没有信息", "NO_DATA")
    if spend < MIN_SPEND_USD and any(m in stripped for m in markers):
        return False, "marked no-data and spend below threshold", spend
    if spend < MIN_SPEND_USD:
        return False, f"spend ${spend:.2f} < min ${MIN_SPEND_USD:.2f}", spend
    return True, f"spend ${spend:.2f}; send allowed", spend


def markdown_to_post_lines(markdown: str) -> list[list[dict]]:
    lines: list[list[dict]] = []
    for raw in markdown.splitlines():
        text = raw.rstrip()
        if not text:
            lines.append([{"tag": "text", "text": ""}])
            continue
        # Strip simple markdown headings/bold for Feishu post text nodes.
        text = re.sub(r"^#+\s*", "", text)
        text = text.replace("**", "")
        lines.append([{"tag": "text", "text": text}])
    return lines


def build_post_payload(body: str, report_date: str) -> dict:
    return {
        "msg_type": "post",
        "content": {
            "post": {
                "zh_cn": {
                    "title": f"投放日报｜{report_date}",
                    "content": markdown_to_post_lines(body),
                }
            }
        },
    }


def _post_webhook(url: str, payload: dict) -> dict:
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
        return json.loads(raw)


def _ok(result: dict) -> bool:
    return (
        result.get("StatusCode") == 0
        or result.get("code") == 0
        or result.get("msg") == "success"
        or result.get("StatusMessage") == "success"
    )


def main(argv: list[str]) -> int:
    if len(argv) > 1:
        path = Path(argv[1])
        body = path.read_text(encoding="utf-8")
    elif not sys.stdin.isatty():
        body = sys.stdin.read()
    else:
        print("usage: send_daily_report.py <report.md|report.txt>", file=sys.stderr)
        return 2

    ok, reason, spend = should_send(body)
    print(json.dumps({"decision": "send" if ok else "skip", "reason": reason, "spend": spend}, ensure_ascii=False))
    if not ok:
        return 0

    report_date = os.environ.get("REPORT_DATE", "")
    if not report_date:
        m = re.search(r"(\d{4}-\d{2}-\d{2})", body)
        report_date = m.group(1) if m else "unknown"

    payload = build_post_payload(body, report_date)
    webhook = os.environ.get("FEISHU_WEBHOOK_URL", "").strip()
    if os.environ.get("DRY_RUN") == "1":
        print(json.dumps({"dry_run": True, "payload": payload}, ensure_ascii=False))
        return 0
    if not webhook:
        print(
            json.dumps(
                {
                    "ok": False,
                    "error": "FEISHU_WEBHOOK_URL missing",
                    "hint": "export the Feishu bot webhook; do not commit it",
                },
                ensure_ascii=False,
            )
        )
        return 1

    try:
        result = _post_webhook(webhook, payload)
        print(json.dumps({"attempt": 1, "response": result}, ensure_ascii=False))
        if not _ok(result):
            result = _post_webhook(webhook, payload)
            print(json.dumps({"attempt": 2, "response": result}, ensure_ascii=False))
            if not _ok(result):
                return 1
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        print(json.dumps({"attempt": 1, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        try:
            result = _post_webhook(webhook, payload)
            print(json.dumps({"attempt": 2, "response": result}, ensure_ascii=False))
            if not _ok(result):
                return 1
        except Exception as exc2:  # noqa: BLE001
            print(json.dumps({"attempt": 2, "error": str(exc2)}, ensure_ascii=False), file=sys.stderr)
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
