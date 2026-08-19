# テスト資産の現状

`common/procedures.md` が参照する `test-cases.md`（診断ロジックの手動テストケース集）は
プロジェクト直下（`../../../test-cases.md`）に作成済み。`common/scripts/score_diagnostic.py`
で実際に計算した、10タイプの一貫回答・4つの混合回答・完全同点並び替え・確信度低の
各ケースを記録している。課題判定（`scoring.md`「課題配点」）側のテストケースはまだ
未作成（`audit/provenance.md` の既知の欠落を参照）。このディレクトリには
現時点でCodex/Claude Code共通のテストケースを置いていない（テスト本体はプロジェクト直下）。

診断アプリ本体（`prototype-v5/`）の採点ロジックの自動テストは、このSkillとは別に
`prototype-v5/test-scores.js`・`prototype-v5/test-type-patterns.js`・
`prototype-v5/test-issues-and-story.js` として存在する。Skillの対話フロー・提案ロジックの
テストケースを整備する場合は、このディレクトリへ追加し、`../manifest.json` の
`known_gaps` から該当項目を外すこと。
