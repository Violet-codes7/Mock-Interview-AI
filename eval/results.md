# Eval Harness Results

Run against 17 hand-labeled test cases comparing the LLM's answer assessment
("strong" / "partial" / "weak") to human-assigned ground truth.

**Agreement rate: 88.2% (15/17)**

## Mismatches

Both disagreements followed the same pattern: an answer labeled `weak` by a
human was graded `partial` by the model. No mismatches occurred in the
opposite direction — the model never downgraded a correct answer.

This suggests a mild generosity bias: borderline-weak answers (vague but not
entirely wrong) tend to get the benefit of the doubt rather than being marked
weak outright.

## Sample run

```
1/17  | expected: strong  | got: strong  | ✓
2/17  | expected: weak    | got: partial | ✗ MISMATCH
3/17  | expected: partial | got: partial | ✓
4/17  | expected: strong  | got: strong  | ✓
5/17  | expected: weak    | got: weak    | ✓
6/17  | expected: partial | got: partial | ✓
7/17  | expected: strong  | got: strong  | ✓
8/17  | expected: weak    | got: weak    | ✓
9/17  | expected: partial | got: partial | ✓
10/17 | expected: strong  | got: strong  | ✓
11/17 | expected: weak    | got: partial | ✗ MISMATCH
12/17 | expected: strong  | got: strong  | ✓
13/17 | expected: weak    | got: weak    | ✓
14/17 | expected: strong  | got: strong  | ✓
15/17 | expected: partial | got: partial | ✓
16/17 | expected: strong  | got: strong  | ✓
17/17 | expected: weak    | got: weak    | ✓

Agreement rate: 88.2% (15/17)
```
