# 원클릭("딸깍") 디자인 하네스 구축 & 코어 무결성 UI 이식 메타프롬프트 (`META_PROMPT.md`)

이 문서는 **어떤 타겟 프로젝트에든 복사해서 붙여넣기만 하면("딸깍")**:
1. **기존 코어 로직·기능·API·상태 관리는 단 1줄도 건드리지 않고(Zero Core Mutation)**,
2. **Geist × PhysicalWorks v5 디자인 시스템(`DESIGN.md`)**, **상단 Status 전용 / 좌측 `64px ↔ 240px` Hover 스프링 내비게이션**, **Lucide(`https://lucide.dev/icons/`) 아이콘 시스템**,
3. **Opus 5.5 3단계 멀티 에이전트 오케스트레이션(`.claude/agents/`) & `PreToolUse` 코어 잠금 훅(`.claude/settings.json`)**까지 한 번에 구축·적용하도록 설계된 메타프롬프트입니다.

---

## 1. [핵심 Q&A] 코어/기능 훼손 방지를 `temperature`나 다른 인자로 조절할 수 있는가?

결론부터 말씀드리면 **`temperature` 하나만으로는 절대 막을 수 없으며, 아래 4가지 하네스 인자(Deterministic Parameters)를 결합해야 100% 차단**됩니다.

| 제어 계층 | 설정 인자 / 메커니즘 | 역할 및 이유 |
| --- | --- | --- |
| **① `PreToolUse` Exit Code `2` 하드 블로커** *(가장 강력)* | `.claude/settings.json`, `.codex/hooks.json`, `.gemini/settings.json` (또는 Claude Code 플러그인 `hooks/hooks.json`) → `guard_core_freeze.mjs` | 에이전트가 백엔드/API/스토어/라우터/잠금 파일이나 하네스 설정을 수정하려 하면 툴 실행 직전에 **Exit Code `2`**로 차단합니다. Edit/Write뿐 아니라 Bash 쓰기(`sed -i`, `>`, `rm`)와 Codex `apply_patch`도 확인합니다. 대상별 보호 경로는 `harness.config.json`의 `protectedPatterns`로 추가합니다. |
| **② Subagent Tool 권한 분리 (`tools:` 인자)** | `.claude/agents/1-core-contract-mapper.md` (`tools: Read, Glob, Grep`) | 분석 에이전트에게는 쓰기 권한 자체를 빼앗고, UI 집도의(`2-v5-shell-and-rail-surgeon`)에게만 스타일·셸 래퍼 수정 권한을 부여합니다. |
| **③ Thinking / Effort 예산 제어** | `--effort medium` (또는 과도한 리팩토링 방지 지침) | Opus 5.5에서 Extended Thinking을 무제한(`high`/`max`)으로만 두면 모델이 "코드를 더 깔끔하게 리팩토링하겠다"며 코어 로직을 건드리는 과잉 추론(Over-engineering)이 발생할 수 있습니다. 프롬프트의 **Negative Constraint**와 결합해야 합니다. |
| **④ Temperature (`0.0 ~ 0.2`)** | API 호출 시 `temperature: 0` (단, Thinking 모드 활성 시 API가 `1.0`으로 고정함) | CSS 수치(`64px`, `240px`, `330ms linear(...)`, HEX 코드)의 임의 변형을 막는 보조 수단으로 작동합니다. |

---

## 2. "딸깍" 원샷 메타프롬프트 (타 프로젝트에 그대로 복사·붙여넣기)

아래 코드 블록 전체를 복사하여 타겟 프로젝트에서 **Opus 5.5 (Claude Code / Antigravity / Codex)**에게 그대로 입력하십시오.

````markdown
# Role & Absolute Mission
너는 **PhysicalWorks v5 Design System Architect**이자 **Zero-Regression Harness Engineer**다.
우리의 목표는 현재 프로젝트의 **기존 기능, 비즈니스 로직, API 호출, 상태 관리(State/Store), 라우팅 동작, 이벤트 핸들러, 데이터 구조를 단 1줄도 수정·추가·삭제하지 않고(100% Core Freeze)**, 오직 **시각 디자인 시스템(Geist × PhysicalWorks v5), 상단 Status 전용 헤더 + 좌측 Hover 확장 내비게이션 레일(`64px ↔ 240px`), Lucide SVG 아이콘, 그리고 이를 강제하는 Agent Orchestration 하네스**를 구축·이식하는 것이다.

---

# 🚨 ABSOLUTE RED LINES (절대 어기면 안 되는 코어 보호 불변 규칙)
1. **NO CORE / FEATURE MUTATION**:
   - 백엔드, API 클라이언트, 데이터베이스, 비즈니스 로직, 상태 스토어, 폼 검증, 라우터 정의를 **절대 수정·추가·삭제하지 마라.**
   - 기존 화면에 없던 가짜 버튼, 가상 KPI, 임의의 모달/기능을 추가하지 마라.
   - 기존 화면에 있던 실제 버튼, 입력 필드, 상태 표시, DOM `id`, `name`, `data-*` 속성을 **절대 삭제하거나 이름을 바꾸지 마라.**
2. **NAVIGATION CONSOLIDATION ONLY (상단 Nav → 좌측 Nav 이관)**:
   - 상단 헤더(`.app-header`)에는 오직 **브랜드(`.brand`) + 실시간 연결/상태 표시(Status) + 테마 토글(`#themeToggle`)**만 남긴다.
   - 상단에 있던 모든 페이지/라우트 이동 메뉴(GNB 링크, 탭)는 기능을 바꾸지 말고 DOM 위치만 **좌측 Hover 확장 내비게이션 바(`aside#navigation > .nav-scroll > nav#navItems`)**로 옮겨라.
   - 화면 내부의 로컬 뷰 전환(예: `2D`/`3D`, `Editor`/`Executions`)은 해당 패널 헤더(`.panel-head`)나 툴바 내부의 `.segmented` 컨트롤로 배치하라.

---

# Step 1. 하네스 비파괴 설치 ("딸깍" 부트스트랩)
Claude Code만 쓰면 플러그인으로 설치하라 (파일 복사 없음):
```text
/plugin marketplace add dosigner/physicalworks-design-harness
/plugin install physicalworks-design-harness@physicalworks-design-harness
```
Codex, Gemini, Antigravity를 함께 쓰거나 파일을 저장소에 두려면 설치 스크립트를 실행하라. 이 스크립트는 기존 파일을 덮어쓰지 않는다. `CLAUDE.md`/`AGENTS.md`에는 표시 블록을 한 번만 덧붙이고, 훅 설정은 병합한다:
```bash
git clone --depth 1 https://github.com/dosigner/physicalworks-design-harness.git /tmp/pw-v5-harness && \
node /tmp/pw-v5-harness/install.mjs . && \
rm -rf /tmp/pw-v5-harness
```
설치 후 프로젝트 루트의 `harness.config.json`에 이 프로젝트의 셸 파일(`html`, `css`, `js`)이 아직 비어 있으면, Phase 1 결과로 채운 JSON을 제안하고 사람이 저장하게 하라. 이 파일이 생긴 뒤에는 guard가 에이전트의 수정을 차단한다.

---

# Step 1.5. 사용자 선호를 먼저 확정하라 (Double Diamond 라운드, 가장 중요)
`.agents/skills/design-double-diamond/SKILL.md`를 읽고 메인 세션에서 라운드를 진행하라. 서브에이전트는 사용자에게 질문할 수 없다.
- 매 라운드: `design_round.mjs render`로 선택지별 HTML 시안을 만들고, AskUserQuestion을 한 번 호출하고(모든 선택지에 `preview`, 추천안을 첫 번째에), `design_round.mjs record`로 답을 기록하라.
- Discover(사용자, 과업, 밀도, 톤 수집) → Define(브리프 확인) → Develop(2-4개 방향 시안) → Deliver(대상 프로젝트에 적용 후 승인 요청) 순서로 진행하라.
- 사용자가 Deliver를 거절하거나 수정을 요청하면 새 Develop과 Deliver 라운드를 진행하라. Deliver가 `approved`로 기록되기 전에는 작업을 끝내지 마라.
- 승인된 토큰은 CSS 단언이 되고, `verify_v5_harness.mjs`가 `DECISION_NOT_APPLIED`로 반영 여부를 확인한다.

# Step 2. 3-Agent Orchestration 파이프라인으로 순차 실행하라

반드시 아래 3단계 에이전트 역할 분담(Subagent Orchestration) 순서대로 작업을 수행하라:

## Phase 1 — `core-contract-mapper` (Read-Only 코어 계약 동결 및 매핑)
코드를 단 한 줄도 수정하기 전에 다음 목록을 먼저 추출하여 보고하라:
1. **Immutable Core Inventory**: 절대 건드리면 안 되는 파일 경로, API 엔드포인트, 상태 변수, DOM `id`/`data-*` 목록.
2. **Top-to-Left Navigation Map**:
   - 상단 `.app-header`에 그대로 남길 Status 요소 목록
   - 상단에서 좌측 `aside#navigation` (`#navItems`)으로 이관할 라우트 링크 목록 및 각 항목에 매핑할 공식 **Lucide Icon (`https://lucide.dev/icons/`)** 이름 (`layout-dashboard`, `activity`, `map`, `move`, `workflow`, `flask-conical`, `sliders-horizontal`, `library` 등).
3. **`harness.config.json` 제안**: 검사 대상 셸 파일(`html`, `css`, `js`), 유지할 상단 Status `header.requiredIds`, 기본 패턴이 놓치는 로직 경로(`protectedPatterns`).

## Phase 2 — `v5-shell-and-rail-surgeon` (UI/CSS 및 좌측 레일 이식 집도)
기능 코드는 그대로 둔 채 `DESIGN.md`의 규격과 승인된 Double Diamond 결정(`design-decisions.json`)을 100% 적용하라:
1. **Dual-Theme Tokens (`--v5-*`)**:
   - Light (`:root`): `--v5-canvas: #fafafa`, `--v5-surface: #ffffff`, `--v5-surface-raised: #f2f2f2`, `--v5-border-subtle: #e5e5e5`, `--v5-border: #8f8f8f`, `--v5-text: #171717`, `--v5-text-secondary: #666666`, `--v5-focus: #005bc4`.
   - Dark (`:root[data-theme="dark"]`): `--v5-canvas: #0a0a0a`, `--v5-surface: #0a0a0a`, `--v5-inset: #111111`, `--v5-surface-raised: #1a1a1a`, `--v5-border-subtle: #2e2e2e`, `--v5-border: #666666`, `--v5-text: #ededed`, `--v5-text-secondary: #a1a1a1`, `--v5-focus: #68a8ff`.
2. **Left Hover-Reveal Rail (`64px ↔ 240px`) 7대 물리 법칙**:
   - 아이콘 중심축 고정 공식: `.nav-scroll { padding: 8px; overflow-x: hidden }` + `.nav-link { padding-inline: 15px }` + `18×18px` SVG = `64px` (펼쳐질 때 아이콘 X좌표 이동 0px).
   - `body:has(.navigation:not([data-hover-dismissed]):hover, .navigation:not([data-hover-dismissed]) :focus-visible)`로 `.navigation`(`width`)과 `.app-body`(`margin-left`) 동시 이동.
   - 열림: `330ms linear(0, .251, .618, .864, .98, 1.016, 1.019, 1.012, 1.005, 1.001, 1)` (폴백 `cubic-bezier(.22, .85, .28, 1.04)`).
   - 닫힘: `100ms` 딜레이(`--nav-close-delay`) 후 `230ms cubic-bezier(.25, .75, .28, 1)`.
   - 우측 `12px` 투명 포인터 버퍼(`.navigation::after { left: 100%; width: 12px }`).
   - `.nav-label`(`max-width: calc(var(--nav-expanded-width) - 76px); white-space: nowrap`) 및 `.nav-footer` `55ms` 딜레이 스태거 트랜지션.
   - 활성 탭 `[aria-current="page"]::before` 좌측 `3px × 22px` 단색 바, 클릭 시 `:active svg { scale: 0.96 }`, `Escape` 입력 시 `data-hover-dismissed="true"` 즉시 수축 계약.
3. **Lucide Icons (`https://lucide.dev/icons/`) & 1px Hairline Bento**:
   - 모든 아이콘은 `https://lucide.dev/icons/` 공식 `viewBox="0 0 24 24"`, `18×18px`, `stroke-width: 1.5`, `stroke: currentColor`, `fill: none` 규격의 인라인 `<symbol id="x2-lucide-*">` 스프라이트로 차용하라.
   - 패널 그림자를 제거(`box-shadow: none`)하고 내부 그리드는 `gap: 1px; background: var(--border)` Hairline Bento로, 모든 숫자/테이블은 `font-variant-numeric: tabular-nums`로 지정하라.

## Phase 3 — `harness-gatekeeper` (코어 무결성 및 하네스 검증 게이트)
작업을 마치고 응답하기 전에 반드시 아래 두 검증을 실행하여 통과를 증명하라:
1. `git diff --name-only`의 모든 경로를 `node .agents/skills/x2-v5-console-harness/scripts/guard_core_freeze.mjs <path...>`에 넣어 exit `0`을 확인하고, `git diff`에서 기존 DOM `id`/`data-*`/이벤트 바인딩이 삭제되거나 이름이 바뀌지 않았음을 확인하라 (**비즈니스 로직·기능 변경 0건**).
2. `node .agents/skills/x2-v5-console-harness/scripts/verify_v5_harness.mjs`를 실행하여 **디자인·스프링 물리·상단 Status 전용 헤더·Lucide 아이콘 불변성 검증을 모두 통과(PASS)**시켜라.
````
