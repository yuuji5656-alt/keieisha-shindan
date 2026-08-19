# テスト資産の現状

`common/procedures.md` が参照する `test-cases.md`（診断ロジックの手動テストケース集）は、
本リポジトリに実体がない（`audit/provenance.md` の既知の欠落を参照）。このディレクトリには
現時点でCodex/Claude Code共通のテストケースを置いていない。

診断アプリ本体（`prototype-v5/`）の採点ロジックの自動テストは、このSkillとは別に
`prototype-v5/test-scores.js`・`prototype-v5/test-type-patterns.js`・
`prototype-v5/test-issues-and-story.js` として存在する。Skillの対話フロー・提案ロジックの
テストケースを整備する場合は、このディレクトリへ追加し、`../manifest.json` の
`known_gaps` から該当項目を外すこと。
