---
name: keieisha-shindan
description: 経営者の意思決定傾向を10タイプで診断し、現在の経営課題と事業段階を独立して分析し、補完人材や次の行動を提案する。経営者タイプ診断、経営スタイル分析、経営相談への診断結果の適用、相性のよいNo.2、役員・幹部チームの偏り分析、診断質問や採点の改善を依頼されたときに使う。
allowed-tools: Read, Bash
---

# 経営者診断（Claude Code版）

本体の手順は `../common/procedures.md` を読み込んで実行する。データは
`data/scoring.json`（書き出し先 `.claude/skills/keieisha-shindan/data/scoring.json`）を正とする。

このファイルはClaude Code側の発動条件・frontmatter（`allowed-tools` 等）のみを持つ薄い差分。
手順の追記・修正は `../common/procedures.md` へ行い、Claude Codeの実行ファイルである
`.claude/skills/keieisha-shindan/SKILL.md` へ書き出す。
