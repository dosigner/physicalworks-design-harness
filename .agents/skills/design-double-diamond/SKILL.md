---
name: design-double-diamond
description: >-
  Use this skill before and during any design port, redesign, or visual change made with the PhysicalWorks v5
  harness. Runs the Double Diamond (Discover, Define, Develop, Deliver) as rounds: each round asks the user with
  AskUserQuestion, shows the options as rendered HTML previews, and records the answer in design-decisions.json.
  Approved decisions become CSS assertions that verify_v5_harness.mjs enforces, so the delivered UI matches what
  the user chose. Do not finish a design task until the user approves a Deliver round.
---

# Design Double Diamond: user preference rounds

The user's preferences are the input of every design decision. Never infer a preference that you can ask about.
Every round produces three artifacts: an HTML preview, one AskUserQuestion call, and one ledger entry.

## 0. Who runs this

- The main session runs every round. Subagents cannot call AskUserQuestion.
- Subagents work inside rounds: `core-contract-mapper` in Discover, `v5-shell-and-rail-surgeon` in Deliver, `harness-gatekeeper` after Deliver.
- Codex, Gemini or any agent without AskUserQuestion: ask the same questions in chat as a numbered list (1/2/3), show the same HTML paths, wait for the answer, then record it.

## 1. Round protocol (repeat for every round)

1. Write the round spec to `design-rounds/round-NN-<phase>.spec.json` (format in section 4).
2. Render the previews:
   ```bash
   node .agents/skills/design-double-diamond/scripts/design_round.mjs render --spec design-rounds/round-NN-<phase>.spec.json
   ```
   The command prints the `index.html` path and, for each option, its HTML file and a `preview` string.
3. Call AskUserQuestion once for the round:
   - 1-4 questions. Each question stands alone: name what is being decided, why it matters, and the `index.html` path to open.
   - 2-4 options per question. Put the recommended option first with "(Recommended)" at the end of its label.
   - Every option has `preview`: the `preview` string from step 2, or a short ASCII or HTML snippet of the layout. The user compares options side by side.
   - Use `multiSelect: true` only for Discover questions where several answers can be true together.
4. Record the answer, including free text from "Other":
   ```bash
   node .agents/skills/design-double-diamond/scripts/design_round.mjs record --spec design-rounds/round-NN-<phase>.spec.json --answer <option id or text> --status <answered|approved|rejected> --notes "<user's words>"
   ```
5. Tell the user in one or two sentences what was recorded and what the next round decides.

## 2. The two diamonds

| Round | Phase | Mode | Goal | Status to record |
|---|---|---|---|---|
| 1 | Discover | diverge | Learn who uses the screen, the main task, density, tone, reference products, brand constraints. Render mood options (accent, radius, density, type scale) on the reference shell. | `answered` |
| 2 | Define | converge | Show a one-page brief built from round 1 (priorities, must-keep elements, constraints). Ask the user to confirm or correct it. | `answered` |
| 3 | Develop | diverge | Render 2-4 complete design directions that satisfy the brief, on the reference shell or a static copy of the target shell (`spec.base`). | `answered` |
| 4 | Deliver | converge | The surgeon applies the chosen direction to the target project. Render the applied tokens as the preview and ask for approval. | `approved` or `rejected` |

- If the user rejects Deliver, picks "Other", or asks for changes, start a new Develop round (round 5, 6, ...) that uses their feedback, then a new Deliver round. Repeat until a Deliver round is `approved`.
- Ask again whenever a later step needs a decision that no earlier round covered (for example a nav label, an icon, or a status element). Use a small round with the current phase.
- Keep options inside the `DESIGN.md` invariants (rail physics, `--v5-*` structure, Lucide, accessibility). If the user wants to break one, say which gate code it breaks (for example `NAV_RAIL_VARS`) and that a human must add that code to `waive` in `harness.config.json`. Do not edit that file.

## 3. How the decision is enforced

- `record --status approved` converts the chosen option's `tokens`, `darkTokens` and `assertions` into CSS assertions in the ledger.
- `verify_v5_harness.mjs` fails with `DECISION_NOT_APPLIED` when the target CSS does not declare an approved assertion. A later approved round replaces an earlier decision on the same selector and property.
- With `"requireApprovedDesign": true` in `harness.config.json` (the installer default for target projects), verify fails with `DESIGN_NOT_APPROVED` until a Deliver round is approved.
- Record only what the user answered. A ledger entry that the user did not choose defeats the harness.

## 4. Round spec format

```json
{
  "round": 3,
  "phase": "develop",
  "title": "디자인 방향",
  "question": "세 방향 중 이 화면의 기본 방향은 무엇입니까? design-rounds/round-03-develop/index.html 에서 라이트와 다크를 비교하세요.",
  "base": ".agents/skills/x2-v5-console-harness/reference/console.html",
  "options": [
    {
      "id": "A",
      "label": "모노크롬 정밀형 (Recommended)",
      "description": "무채색 강조, 12px 패널 반경, 기본 밀도",
      "tokens": { "--v5-interactive": "#171717", "--geist-control-radius": "6px" },
      "darkTokens": { "--v5-interactive": "#ededed" }
    },
    {
      "id": "B",
      "label": "브랜드 강조형",
      "description": "브랜드 청색 강조, 8px 컨트롤 반경",
      "tokens": { "--v5-interactive": "#1757a6", "--geist-control-radius": "8px" },
      "assertions": [{ "selector": ".panel", "decl": "border-radius:12px" }]
    }
  ]
}
```

`tokens` apply to both themes, `darkTokens` only to `:root[data-theme="dark"]`. `css` adds extra preview rules. `assertions` add checks beyond the tokens.
