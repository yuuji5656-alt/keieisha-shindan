# 出典・移植記録

## 出典

- 原本：`skills/keieisha-shindan/SKILL.md`（Codexが作成した経営者診断アプリのSkill）
- 権利者：本リポジトリのオーナー（yuuji5656-alt）。外部素材の転載なし。

## 移植の経緯

Codex/Claude Code間のSkill共有方針（共通原本＋Codex差分＋Claude差分の3分割）に基づき、
Claude Codeが `skill-vault/keieisha-shindan/` を正式登録した。Codexは移植候補の提示のみで、
skill-vaultへの正式登録とClaude Code側への導入はClaude Codeが担当する運用ルールに従っている。

## 実施内容

1. `skills/keieisha-shindan/SKILL.md` の本文（frontmatterを除く全体）を
   `common/procedures.md` として抽出。内容は無改変。
2. `skills/keieisha-shindan/data/scoring.json` を `common/data/scoring.json` へコピー（正本化）。
3. Codex用・Claude Code用それぞれの薄いSKILL.md（frontmatterと発動条件のみ）を
   `codex/SKILL.md`・`claude-code/SKILL.md` として新規作成。
4. Claude Code側の実行コピーを `.claude/skills/keieisha-shindan/`（SKILL.md + data/scoring.json）
   として新規に書き出した。
5. Codex側の実行コピー `skills/keieisha-shindan/` は変更していない
   （既存の運用ドキュメント `別のパソコンで開発を再開する手順.md` がこのパスを前提にしているため）。

## 検証したこと・していないこと

- 本文の転記に差分がないことを目視確認した。
- `.claude/skills/keieisha-shindan/SKILL.md` を実際にClaude Codeへ発動させての動作確認は
  していない（発動条件・診断フローそのものはCodex版と同一手順のため、原本側で確認済みの
  内容を踏襲している）。

## 既知の欠落（移植前から存在、今回のスコープ外）

`SKILL.md`（common/codex/claude-codeいずれも）が参照する以下のファイルは、
本リポジトリに実体がない。`ClaudeCodeへの引き継ぎ_2026-08-18.md` の未完了事項4でも
同じ指摘がある。今回の移植では作成していない。

- `references/diagnostic-rules.md`
- `test-cases.md`
- `naming.md`
- `scripts/score_diagnostic.py`
