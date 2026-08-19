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

## 追記：参照先ファイルの新規作成（2026-08-19）

移植時点で存在しなかった参照先を、オーナーの依頼（「あるものは全部作っておきたい」）
により作成した。

- `common/scripts/score_diagnostic.py`（新規）：`scoring.md`の配点・正規化・同点判定
  ルールをそのまま実装。`skills/keieisha-shindan/data/scoring.json`を実データとして
  読み込み、10タイプの一貫回答が想定タイプ第1位（正規化点100.00）になることと、
  4つの混合回答ケースで想定2タイプが上位2位に入ることを実行して確認済み
  （詳細と再現コマンドは `../../../test-cases.md`）。
  `skills/keieisha-shindan/scripts/`・`.claude/skills/keieisha-shindan/scripts/` へ書き出し済み。
- `common/references/diagnostic-rules.md`（新規）：SKILL.mdの必須原則、scoring.mdの
  順位・確信度・同点判定ルール、課題の独立根拠ルールを実行時参照用に統合。新しい
  判定基準の創作はしていない（既存文書の抜粋・整理のみ）。
  `skills/keieisha-shindan/references/`・`.claude/skills/keieisha-shindan/references/` へ書き出し済み。
- `test-cases.md`（プロジェクト直下・新規）：上記スクリプトで実際に計算した結果を記録。
- `naming.md`（プロジェクト直下・新規）：名称候補は意図的に空欄のまま。SKILL.mdの
  「未確定の公開名称を勝手に確定しない」原則により、Claude Codeが公開名称を創作する
  ことはしていない。進め方の手順とタイプ対応表のみ用意した。

`test-cases.md`・`naming.md`は`manifest.json`の`project_root_docs`が示すとおり
プロジェクト直下の単一ファイルとして扱い、codex/claude-code別の書き出しはしていない
（types.md等の既存プロジェクト直下ドキュメントと同じ扱い）。

## 既知の欠落（今回のスコープ外として残るもの）

- `naming.md`：10タイプとも公開名称が未確定（意図的）。
- `test-cases.md`：課題判定（`scoring.md`「課題配点」）側のテストケースは未作成。
  タイプ判定側のテストケースのみ作成済み。
