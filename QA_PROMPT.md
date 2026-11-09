# Opus 5.5 전용 QA · 하네스 아키텍처 & 디자인 완성도 감사 프롬프트 (`QA_PROMPT.md`)

아래 프롬프트를 복사하여 **Opus 5.5 (Claude Code / Antigravity / Codex)**에게 입력하면, 현재 프로젝트(또는 이식 완료된 타겟 앱)의 **① 코어/기능 무결성(Core-Freeze), ② 하네스 엔지니어링 구성도, ③ 좌측 Hover 내비게이션(`64px ↔ 240px`) 스프링 물리, ④ Geist × PhysicalWorks v5 시각 완성도**를 100점 만점 루브릭으로 정밀 감사(QA)하고 리포트를 출력합니다.

---

## 📋 복사해서 바로 쓰는 Opus 5.5 QA 감사 프롬프트

```markdown
# Role & Objective
너는 **Principal Design Systems QA Auditor**이자 **AI Harness Architecture Reviewer**다.
현재 워크스페이스(또는 대상 애플리케이션)를 정밀 검사하여, **코드를 임의로 수정하지 말고(Read-Only Audit)** 아래 5대 감사 축에 따라 **하네스 구성도 검증 + 디자인 완성도 채점표(100점 만점) + 보완 권고안**을 작성하라.

---

# 1. 필수 실행 검증 (Deterministic Automated Checks)
먼저 아래 명령들을 실행하여 정량적/기계적 통과 여부를 확인하라:
1. `node .agents/skills/x2-v5-console-harness/scripts/verify_v5_harness.mjs`
2. `node .agents/skills/x2-v5-console-harness/scripts/guard_core_freeze.mjs`
3. `git status -s` 및 `git diff --stat` (기존 비즈니스 로직·API·스토어·라우터 파일 변경이 0건인지 확인)

---

# 2. 5대 QA 감사 루브릭 (총 100점 만점)

각 항목을 실제 코드(`DESIGN.md`, `CLAUDE.md`, `.claude/`, `.agents/skills/`, HTML/CSS/JS)에서 대조하여 점수와 근거(파일명:라인번호)를 제시하라.

### ① Core-Freeze & Harness Architecture 완성도 (25점)
- [ ] **코어/기능 불변성 (10점)**: 백엔드/API/상태 관리/비즈니스 이벤트 핸들러 및 기존 DOM `id`/`data-*` 바인딩이 단 1줄도 훼손·추가·삭제되지 않았는가?
- [ ] **PreToolUse 하드 블로커 (5점)**: `.claude/settings.json`에 `guard_core_freeze.mjs`가 `PreToolUse` 훅(Exit Code `2` 차단)으로 정상 연결되어 있는가?
- [ ] **3-Agent 권한 분리 오케스트레이션 (5점)**: `.claude/agents/`의 `1-core-contract-mapper`(Read-Only) → `2-v5-shell-and-rail-surgeon`(UI/CSS 전용) → `3-harness-gatekeeper`(검증 전용) 파이프라인과 도구 권한(`tools:`)이 분리되어 있는가?
- [ ] **PostToolUse / Stop 자가 치유 루프 (5점)**: 수정 직후 및 턴 종료 시 `verify_v5_harness.mjs`가 자동 실행되는가?

### ② 상단 Status 전용 & 좌측 내비게이션 단일화 (20점)
- [ ] **상단 헤더 순수성 (10점)**: `.app-header` 안에 페이지 이동 링크(Top GNB, 탭 메뉴, 브레드크럼)가 0개이며, 오직 `.brand` + 실시간 Status(`#connectButton`, `.status-summary`) + `#themeToggle`만 존재하는가?
- [ ] **좌측 레일 통합 & 로컬 `.segmented` 분리 (10점)**: 모든 최상위 라우트가 `aside#navigation` (`#navItems`) 내부의 `.nav-link`로 통합되었고, 패널 내부 뷰 전환(`2D`/`3D`, `Editor`/`Executions`)은 `.panel-head` 또는 `.toolbar` 안의 `.segmented` 컨트롤로 귀속되었는가?

### ③ 좌측 Nav (`64px ↔ 240px`) 7대 스프링 물리 & 인터랙션 (25점)
- [ ] **아이콘 중심축 고정 수학 (5점)**: `.nav-scroll { padding: 8px; overflow-x: hidden }` + `.nav-link { padding-inline: 15px }` + `18×18px` SVG = `64px` 공식으로 접힘/펼침 시 아이콘 X좌표 흔들림이 0px인가?
- [ ] **Zero-Overlap Lockstep (4점)**: `body:has(...)` 단일 상태 머신으로 `.navigation`(`width`)과 `.app-body`(`margin-left`)가 동일 타이밍으로 함께 이동하는가?
- [ ] **비대칭 감쇠 스프링 물리 (4점)**: 열림 `330ms linear(0, .251, .618, .864, .98, 1.016, 1.019, 1.012, 1.005, 1.001, 1)`(약 2% 오버슈트) vs 닫힘 `100ms` 유예(`--nav-close-delay`) 후 `230ms cubic-bezier(.25, .75, .28, 1)`이 정확히 선언되었는가?
- [ ] **우측 `12px` 포인터 버퍼 (3점)**: `.navigation::after { left: 100%; width: 12px }`로 경계선 Hover 떨림을 막았는가?
- [ ] **줄바꿈 방지 스태거 (3점)**: `.nav-label`(`max-width: calc(var(--nav-expanded-width) - 76px); white-space: nowrap`) 및 `.nav-footer`가 열릴 때 `55ms` 딜레이로 페이드/슬라이드 인 되는가?
- [ ] **활성 탭 `3px` 바 & 클릭 텐션 (3점)**: `[aria-current="page"]::before` 좌측 `3px × 22px` 단색 바와 `:active svg { scale: 0.96 }`이 적용되었는가?
- [ ] **`Escape` 즉시 수축 계약 (3점)**: `Escape` 키 입력 시 `data-hover-dismissed="true"`(`0ms` 딜레이)로 즉시 닫히고 `pointerenter`/`focusin` 시 해제되는가?

### ④ Geist × PhysicalWorks v5 표면·타이포·Anti-Slop 규율 (15점)
- [ ] **무채색 3단계 표면 & 듀얼 테마 (5점)**: 라이트(`#fafafa`/`#ffffff`/`#f2f2f2`)와 다크(`#0a0a0a`/`#111111`/`#1a1a1a`) `--v5-*` 토큰만 사용하며 파편화된 로컬 팔레트가 없는가?
- [ ] **무그림자 패널 & 1px Hairline Bento (5점)**: `.panel`에 `box-shadow: none`이 적용되었고, 내부 그리드가 카드 중첩 대신 `gap: 1px; background: var(--border)` Hairline Bento를 사용하는가?
- [ ] **수치 고정폭 & 그라데이션 절제 (5점)**: 모든 수치/테이블에 `font-variant-numeric: tabular-nums`가 적용되었고, 일반 버튼(`.button.primary`)에 장식용 그라데이션이나 Hover `transform`이 없는가?

### ⑤ Lucide SVG 아이콘 시스템 & 접근성 복원력 (15점)
- [ ] **공식 Lucide(`https://lucide.dev/icons/`) 규격 (8점)**: 모든 아이콘이 `viewBox="0 0 24 24"`, `18×18px`, `stroke: currentColor`, `stroke-width: 1.5`, `stroke-linecap: round`, `stroke-linejoin: round`, `fill: none` 규격의 `<symbol id="x2-lucide-*">` 스프라이트로 통합되었는가? (이모지나 타 아이콘 팩 혼용 0건)
- [ ] **WCAG 2.2 AA & 200% Zoom / Reduced Motion (7점)**: `min-height: 44px` 터치 타깃, `:focus-visible` `2px` 포커스 링, `@media (prefers-reduced-motion: reduce)`, `320px`/200% 텍스트 확대 대응(`syncStickyOffsets`)이 모두 작동하는가?

---

# 3. 출력 형식 (Required Output Format)
반드시 아래 순서로 QA 리포트를 출력하라:
1. **하네스 아키텍처 & 에이전트 파이프라인 구성도 (Mermaid Flowchart)**
2. **자동 검증 스크립트 실행 결과 요약 (`PASS` / `FAIL`)**
3. **5대 부문별 채점표 (점수 / 만점, 통과 항목, 감점 사유 및 파일:라인 근거)**
4. **코어 로직 보존 감사 결과 (Core-Freeze Verification: Modified Core Files = 0 확인)**
5. **우선순위별 개선 권고안 (P0 치명적 결함 / P1 시각·모션 편차 / P2 마이크로 폴리싱)**
```
