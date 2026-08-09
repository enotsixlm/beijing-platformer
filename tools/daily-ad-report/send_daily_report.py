#!/usr/bin/env python3
"""Send 投放日报 to Feishu, or skip when there is no meaningful spend.

Empty-send rule (required):
  If combined TikTok + Meta spend for the report day is below MIN_SPEND_USD,
  do NOT post to Feishu. Exit 0 with a skip message so cron/automations
  stay quiet on zero-spend days.

Required env for actual send:
  FEISHU_WEBHOOK_URL  — Feishu/Lark custom bot webhook

Optional env:
  MIN_SPEND_USD       — threshold to treat as empty (default: 1.0)
  REPORT_PATH         — markdown file to send (default: stdin or argv[1])
  REPORT_DATE         — YYYY-MM-DD label in the card title
  DRY_RUN             — if "1", print payload and do not POST
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
    """Best-effort total spend extraction from the daily report markdown."""
    total = 0.0
    # Prefer explicit 合计 row if present.
    for line in markdown.splitlines():
        if "合计" in line and "$" in line:
            amounts = re.findall(r"\$([0-9]+(?:\.[0-9]+)?)", line)
            if amounts:
                return float(amounts[0])
    # Fallback: first TikTok / Meta 消耗 lines.
    for label in ("TikTok", "Meta"):
        m = re.search(
            rf"{label}[^\n]*?消耗\s*\*?\*?\s*\$([0-9]+(?:\.[0-9]+)?)",
            markdown,
            re.IGNORECASE,
        )
        if m:
            total += float(m.group(1))
    if total > 0:
        return total
    # Last resort: all $ amounts after 消耗.
    for m in re.finditer(r"消耗[^\n$]*\$([0-9]+(?:\.[0-9]+)?)", markdown):
        total += float(m.group(1))
    return total


def _has_report_body(markdown: str) -> bool:
    stripped = markdown.strip()
    if not stripped:
        return False
    empty_markers = ("暂无消耗", "无投放数据", "没有信息", "no spend", "NO_DATA")
    if any(m in stripped for m in empty_markers) and _parse_spend(stripped) < MIN_SPEND_USD:
        return False
    return True


def should_send(markdown: str) -> tuple[bool, str, float]:
    if not _has_report_body(markdown):
        return False, "report body empty or marked as no-data", 0.0
    spend = _parse_spend(markdown)
    if spend < MIN_SPEND_USD:
        return (
            False,
            f"combined spend ${spend:.2f} < min ${MIN_SPEND_USD:.2f}; skip send",
            spend,
        )
    return True, f"combined spend ${spend:.2f}; send allowed", spend


def _build_card(markdown: str, report_date: str) -> dict:
    # Feishu interactive card supports a truncated md body.
    body = markdown.strip()
    if len(body) > 3500:
        body = body[:3400] + "\n\n…（正文过长，已截断）"
    return {
        "msg_type": "interactive",
        "card": {
            "header": {
                "title": {
                    "tag": "plain_text",
                    "content": f"投放日报 · {report_date}",
                },
                "template": "blue",
            },
            "elements": [
                {
                    "tag": "div",
                    "text": {"tag": "lark_md", "content": body},
                }
            ],
        },
    }


def _post_webhook(url: str, payload: dict) -> None:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"non-JSON Feishu response: {raw}") from exc
        if parsed.get("code", 0) not in (0, None) and parsed.get("StatusCode", 0) not in (
            0,
            None,
        ):
            raise RuntimeError(f"Feishu webhook error: {parsed}")
        print(json.dumps({"ok": True, "response": parsed}, ensure_ascii=False))


def main(argv: list[str]) -> int:
    if len(argv) > 1:
        report_path = Path(argv[1])
        markdown = report_path.read_text(encoding="utf-8")
    elif not sys.stdin.isatty():
        markdown = sys.stdin.read()
        report_path = Path(os.environ.get("REPORT_PATH", "-"))
    else:
        report_path = Path(os.environ.get("REPORT_PATH", ""))
        if not report_path or not report_path.exists():
            print("usage: send_daily_report.py <report.md>", file=sys.stderr)
            return 2
        markdown = report_path.read_text(encoding="utf-8")

    ok, reason, spend = should_send(markdown)
    print(json.dumps({"decision": "send" if ok else "skip", "reason": reason, "spend": spend}, ensure_ascii=False))
    if not ok:
        # Explicit no-send path for empty days.
        return 0

    webhook = os.environ.get("FEISHU_WEBHOOK_URL", "").strip()
    report_date = os.environ.get("REPORT_DATE", "")
    if not report_date:
        m = re.search(r"投放日报\s*[·•]\s*(\d{4}-\d{2}-\d{2})", markdown)
        report_date = m.group(1) if m else "unknown"

    payload = _build_card(markdown, report_date)
    if os.environ.get("DRY_RUN") == "1" or not webhook:
        if not webhook:
            print(
                json.dumps(
                    {
                        "ok": False,
                        "error": "FEISHU_WEBHOOK_URL missing; report not posted",
                        "hint": "set webhook then re-run; empty days still skip automatically",
                    },
                    ensure_ascii=False,
                )
            )
            return 1
        print(json.dumps({"dry_run": True, "payload": payload}, ensure_ascii=False))
        return 0

    try:
        _post_webhook(webhook, payload)
    except (urllib.error.URLError, RuntimeError) as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
