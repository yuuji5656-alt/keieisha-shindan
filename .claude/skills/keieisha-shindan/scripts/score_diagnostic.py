#!/usr/bin/env python3
"""標準診断25問（scoring.md v0.1）の採点を再現するスクリプト。

25文字のABCD回答列から、生点・理論最大点・正規化点・表示比率・順位・
同点時の判定を計算する。配点表は data/scoring.json を正とし、この
スクリプトに配点を直接書かない。

使い方:
    python score_diagnostic.py ABCDで構成した25文字 [--compact] [--uncertain N]

--uncertain N: 「どれも近くない」として自由回答→最も近い選択肢へ確認した
    回答の数（0〜25）。5以上で確信度を「低」と表示する（scoring.md準拠）。
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

TYPE_NAMES = {
    "T01": "事業創造",
    "T02": "仕組み資産",
    "T03": "組織拡張",
    "T04": "市場攻略",
    "T05": "志の実現",
    "T06": "資本戦略",
    "T07": "品質探究",
    "T08": "社会使命",
    "T09": "発信牽引",
    "T10": "永続継承",
}

CRISIS_SUCCESS_QUESTIONS = {18, 24, 25}  # scoring.md「危機・成功後質問」（1始まり）
CHOICES = ("A", "B", "C", "D")


def load_scoring_data(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def validate_answers(answers: str, question_count: int) -> None:
    if len(answers) != question_count:
        raise ValueError(
            f"回答は{question_count}文字である必要がある（{len(answers)}文字を受け取った）"
        )
    invalid = sorted(set(answers) - set(CHOICES))
    if invalid:
        raise ValueError(f"A/B/C/D以外の文字が含まれている: {invalid}")


def score_raw(answers: str, questions: list[dict], points: dict) -> dict[str, int]:
    raw = {t: 0 for t in TYPE_NAMES}
    for q_idx, choice in enumerate(answers):
        primary, secondary = questions[q_idx][choice]
        raw[primary] += points["primary"]
        raw[secondary] += points["secondary"]
    return raw


def theoretical_max(questions: list[dict], points: dict) -> dict[str, int]:
    """各問でそのタイプが得られる最大点を25問分合計する（scoring.md準拠）。"""
    max_total = {t: 0 for t in TYPE_NAMES}
    for q in questions:
        per_question: dict[str, int] = {}
        for choice in CHOICES:
            primary, secondary = q[choice]
            per_question[primary] = max(per_question.get(primary, 0), points["primary"])
            per_question[secondary] = max(per_question.get(secondary, 0), points["secondary"])
        for t, v in per_question.items():
            max_total[t] += v
    return max_total


def normalize(raw: dict[str, int], max_total: dict[str, int]) -> dict[str, float]:
    normalized = {}
    for t in TYPE_NAMES:
        m = max_total[t]
        normalized[t] = (raw[t] / m * 100) if m else 0.0
    return normalized


def display_ratio(normalized: dict[str, float]) -> dict[str, float]:
    total = sum(normalized.values())
    if total <= 0:
        return {t: 0.0 for t in normalized}
    return {t: v / total * 100 for t, v in normalized.items()}


def boundary_score(t: str, other: str, answers: str, questions: list[dict], points: dict) -> int:
    """t・otherの両方が選択肢として登場する問だけで、tが得た点の合計。"""
    total = 0
    for q_idx, choice in enumerate(answers):
        q = questions[q_idx]
        types_in_question = {c for pair in q.values() for c in pair}
        if t in types_in_question and other in types_in_question:
            primary, secondary = q[choice]
            if primary == t:
                total += points["primary"]
            elif secondary == t:
                total += points["secondary"]
    return total


def primary_count(t: str, answers: str, questions: list[dict]) -> int:
    return sum(1 for q_idx, choice in enumerate(answers) if questions[q_idx][choice][0] == t)


def crisis_success_score(t: str, answers: str, questions: list[dict], points: dict) -> int:
    total = 0
    for q_num in CRISIS_SUCCESS_QUESTIONS:
        q = questions[q_num - 1]
        choice = answers[q_num - 1]
        primary, secondary = q[choice]
        if primary == t:
            total += points["primary"]
        elif secondary == t:
            total += points["secondary"]
    return total


def tie_break_order(tied_types: list[str], answers: str, questions: list[dict], points: dict) -> list[str]:
    """完全同点タイプ群を scoring.md の順（境界質問→主要点回数→危機成功後点）で並べる。

    2タイプの同点にのみ定義されている「境界質問の関連点」は、3タイプ以上が
    同点の場合は他タイプ全員との境界点合計で近似する。それでも同点なら
    同順位のまま返す（scoring.mdの「同順位」規定どおり）。
    """
    if len(tied_types) < 2:
        return tied_types

    def boundary_total(t: str) -> int:
        return sum(
            boundary_score(t, other, answers, questions, points)
            for other in tied_types
            if other != t
        )

    def sort_key(t: str) -> tuple[int, int, int]:
        return (
            boundary_total(t),
            primary_count(t, answers, questions),
            crisis_success_score(t, answers, questions, points),
        )

    scored = [(sort_key(t), t) for t in tied_types]
    scored.sort(key=lambda x: x[0], reverse=True)

    # 最終基準まで一致するものは同順位のまま元の順を保つ
    ordered = []
    i = 0
    while i < len(scored):
        j = i + 1
        while j < len(scored) and scored[j][0] == scored[i][0]:
            j += 1
        group = sorted((t for _, t in scored[i:j]), key=lambda t: tied_types.index(t))
        ordered.extend(group)
        i = j
    return ordered


def rank_types(normalized: dict[str, float], answers: str, questions: list[dict], points: dict) -> list[str]:
    buckets: dict[float, list[str]] = {}
    for t, v in normalized.items():
        buckets.setdefault(round(v, 6), []).append(t)

    ordered_scores = sorted(buckets.keys(), reverse=True)
    ranking: list[str] = []
    for score in ordered_scores:
        group = buckets[score]
        ranking.extend(tie_break_order(group, answers, questions, points))
    return ranking


def near_tie_note(ranking: list[str], normalized: dict[str, float]) -> str:
    if len(ranking) < 2:
        return ""
    top = [normalized[t] for t in ranking[:3]]
    diff_1_2 = top[0] - top[1]
    notes = []
    if diff_1_2 < 5:
        notes.append("第1位と第2位の差が5点未満のため混合傾向")
    if len(top) >= 3 and all(top[i] - top[i + 1] < 5 for i in range(2)):
        notes.append("上位3つがすべて5点未満の差のため、順位を弱く表示し状況適応傾向を併記")
    return " / ".join(notes) if notes else "上位の差は明確"


def build_report(
    answers: str,
    raw: dict[str, int],
    max_total: dict[str, int],
    normalized: dict[str, float],
    ratio: dict[str, float],
    ranking: list[str],
    uncertain: int,
) -> dict:
    return {
        "version": "0.1",
        "answers": answers,
        "raw": raw,
        "theoretical_max": max_total,
        "normalized": {t: round(v, 2) for t, v in normalized.items()},
        "display_ratio": {t: round(v, 2) for t, v in ratio.items()},
        "ranking": [
            {"rank": i + 1, "type": t, "name": TYPE_NAMES[t], "normalized": round(normalized[t], 2)}
            for i, t in enumerate(ranking)
        ],
        "top3_note": near_tie_note(ranking, normalized),
        "confidence": "低（「どれも近くない」が5問以上）" if uncertain >= 5 else "通常",
        "uncertain_count": uncertain,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="経営者診断・標準版25問の採点")
    parser.add_argument("answers", help="ABCDで構成した25文字の回答列（例: ABCDABCD...）")
    parser.add_argument("--compact", action="store_true", help="JSON1行で出力する")
    parser.add_argument(
        "--uncertain",
        type=int,
        default=0,
        help="「どれも近くない」を確認して選んだ回答の数（0〜25、既定0）",
    )
    parser.add_argument(
        "--data",
        default=None,
        help="scoring.jsonのパス（既定：このスクリプトと同じSkill配下のdata/scoring.json）",
    )
    args = parser.parse_args()

    data_path = Path(args.data) if args.data else Path(__file__).resolve().parent.parent / "data" / "scoring.json"
    if not data_path.exists():
        print(f"採点データが見つからない: {data_path}", file=sys.stderr)
        return 2

    data = load_scoring_data(data_path)
    questions = data["questions"]
    points = data["points"]

    try:
        validate_answers(args.answers.upper(), len(questions))
    except ValueError as e:
        print(f"入力エラー: {e}", file=sys.stderr)
        return 1

    answers = args.answers.upper()
    raw = score_raw(answers, questions, points)
    max_total = theoretical_max(questions, points)
    normalized = normalize(raw, max_total)
    ratio = display_ratio(normalized)
    ranking = rank_types(normalized, answers, questions, points)

    if not (0 <= args.uncertain <= len(questions)):
        print(f"入力エラー: --uncertain は0〜{len(questions)}の範囲", file=sys.stderr)
        return 1

    report = build_report(answers, raw, max_total, normalized, ratio, ranking, args.uncertain)

    if args.compact:
        print(json.dumps(report, ensure_ascii=False))
        return 0

    print(f"回答: {report['answers']}（version {report['version']}）")
    print(f"確信度: {report['confidence']}")
    print()
    print(f"{'順位':>2} {'識別子':<5} {'名称':<8} {'生点':>4} {'理論最大':>6} {'正規化点':>8} {'表示比率':>8}")
    for row in report["ranking"]:
        t = row["type"]
        print(
            f"{row['rank']:>2} {t:<5} {row['name']:<8} "
            f"{raw[t]:>4} {max_total[t]:>6} {normalized[t]:>8.2f} {ratio[t]:>7.2f}%"
        )
    print()
    print(f"上位判定: {report['top3_note']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
