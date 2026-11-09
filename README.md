# PhysicalWorks v5 Design System & Opus 5.5 Harness (`physicalworks-design-harness`)

**Vercel Geist × PhysicalWorks v5 Zero-Chroma Console Theme**, **Left Hover-Reveal Rail (`64px ↔ 240px` Damped Spring)**, **Lucide SVG Icon System (`https://lucide.dev/icons/`)**, and **Core-Freeze Multi-Agent Harness Engineering** for Claude Code (Opus 5.5), Codex, and Antigravity.

![PhysicalWorks v5 Design System & Opus 5.5 Core-Freeze Harness Showcase](./assets/physicalworks-v5-harness-hero.jpg)

![PhysicalWorks v5 Architecture & 7-Point Rail Physics Blueprint](./assets/harness-architecture.svg)


---

## 1. 원칙: 코어 불변(Core-Freeze)과 사용자 선호 반영

이 하네스는 다른 프로젝트의 프레젠테이션 계층에 PhysicalWorks v5 디자인 시스템을 이식합니다. 이식 범위는 디자인 토큰, 상단 Status 전용 헤더, 좌측 Hover 확장 레일, Lucide SVG 아이콘입니다. 비즈니스 로직, 백엔드와 API, 상태 관리, 라우터, DOM `id`와 `data-*` 바인딩은 바꾸지 않습니다.

보호 장치는 다섯 가지입니다.

1. PreToolUse 하드 블로커 ([`guard_core_freeze.mjs`](.agents/skills/x2-v5-console-harness/scripts/guard_core_freeze.mjs)): 보호 경로에 쓰는 도구 호출을 exit `2`로 차단합니다. Edit, Write, MultiEdit, NotebookEdit, Bash 쓰기(`sed -i`, `>`, `rm`, `git checkout --`), Codex `apply_patch`, Gemini `write_file`/`replace`/`run_shell_command`를 확인합니다. 하네스 자신의 훅 설정과 `harness.config.json`도 보호합니다.
2. 대상 지정 검증기 ([`verify_v5_harness.mjs`](.agents/skills/x2-v5-console-harness/scripts/verify_v5_harness.mjs)): `harness.config.json`에 적힌 대상 프로젝트의 셸 파일을 검사합니다. 레일 계약값(330ms, 230ms, 100ms, 55ms, 12px, 3px, 64px), 토큰, 접근성 규칙, 사용자 결정 반영 여부를 확인합니다. CSS 공백을 정규화하므로 압축하지 않은 CSS도 검사합니다. 훅에서는 실패 시 exit `2`를 반환해 에이전트가 결과를 받습니다.
3. 3-Agent 권한 분리 ([`.claude/agents/`](.claude/agents/)): `core-contract-mapper`(읽기 전용) → `v5-shell-and-rail-surgeon`(UI와 CSS만 수정) → `harness-gatekeeper`(검증).
4. 더블 다이아몬드 선호 루프 ([`design-double-diamond`](.agents/skills/design-double-diamond/SKILL.md)): 라운드마다 AskUserQuestion으로 사용자의 선호를 묻고, 선택지를 HTML 시안으로 보여 줍니다. 승인된 결정은 `design-decisions.json`에 CSS 단언으로 남고, verify가 반영 여부를 확인합니다.
5. 모델 실행 인자 가이드 ([`META_PROMPT.md`](META_PROMPT.md)).

---

## 2. 설치

### Claude Code 플러그인 (권장)

```text
/plugin marketplace add dosigner/physicalworks-design-harness
/plugin install physicalworks-design-harness@physicalworks-design-harness
```

플러그인은 스킬, 서브에이전트 3개, 훅을 제공합니다. 플러그인 훅은 모든 프로젝트에서 실행되므로, 프로젝트 루트에 `harness.config.json`이 있을 때만 동작합니다. 프로젝트 파일은 복사하지 않습니다.

### 파일 복사 설치 (Codex, Gemini, Antigravity, 또는 저장소에 하네스를 커밋할 때)

```bash
git clone --depth 1 https://github.com/dosigner/physicalworks-design-harness.git /tmp/pw-v5-harness && \
node /tmp/pw-v5-harness/install.mjs . --html src/index.html --css src/styles/physicalworks_v5.css --js src/nav.js && \
rm -rf /tmp/pw-v5-harness
```

[`install.mjs`](install.mjs)는 기존 파일을 덮어쓰지 않습니다. 동작은 다음과 같습니다.

1. 스킬을 `.agents/skills/`(Codex, Gemini)와 `.claude/skills/`(Claude Code)에 복사합니다. 이미 있는 파일은 건너뜁니다.
2. `CLAUDE.md`와 `AGENTS.md`가 있으면 표시 블록을 한 번만 덧붙입니다.
3. `.claude/settings.json`, `.codex/hooks.json`, `.gemini/settings.json`의 다른 키와 훅을 유지하고 하네스 훅만 병합합니다.
4. 대상 프로젝트에 `DESIGN.md`가 있으면 그대로 두고, 하네스 명세는 스킬 폴더에 설치합니다.
5. `harness.config.json`을 한 번 만듭니다. 이후에는 사람만 수정합니다.

`--dry-run`으로 변경 내용을 먼저 확인할 수 있습니다. 두 방식을 함께 쓰면 훅이 두 번 실행되므로 하나만 선택하세요.

### `harness.config.json`

```json
{
  "design": "DESIGN.md",
  "html": ["src/index.html"],
  "css": ["src/styles/physicalworks_v5.css"],
  "js": ["src/nav.js"],
  "header": { "requiredIds": ["themeToggle"] },
  "icons": { "mode": "sprite", "prefix": "x2-lucide-" },
  "decisions": "design-decisions.json",
  "protectedPatterns": ["^src/hooks/"],
  "allowPatterns": []
}
```

`html`에는 `.html`, `.jsx`, `.tsx` 셸 파일을 쓸 수 있습니다. `lucide-react` 같은 패키지를 쓰면 `icons.mode`를 `"package"`로 바꾸세요. `css`의 첫 항목은 다른 스타일시트보다 뒤에 로드되어야 합니다. 번들 `reference/`를 대상 프로젝트의 검사 대상으로 쓰지 마세요.

---

## 3. 사용법

1. 이식: [`META_PROMPT.md`](META_PROMPT.md)의 프롬프트를 대상 프로젝트의 에이전트에 붙여 넣으세요.
2. 선호 반영 루프: Claude Code에서 `design-double-diamond` 스킬을 실행하세요. 라운드마다 질문과 HTML 시안이 나옵니다.
3. QA 채점: [`QA_PROMPT.md`](QA_PROMPT.md)의 프롬프트를 붙여 넣으세요.
4. 하네스 자체 테스트: 이 저장소에서 `node --test tests/`를 실행하세요.

---

## 4. Repository Structure

```text
physicalworks-design-harness/
├── .claude-plugin/plugin.json, marketplace.json   # Claude Code 플러그인과 마켓플레이스 매니페스트
├── hooks/hooks.json                               # 플러그인 훅 (--plugin: harness.config.json이 없으면 비활성)
├── install.mjs                                    # 비파괴 파일 복사 설치 스크립트
├── harness.config.json                            # 이 저장소의 자체 검사 설정 (reference/ 대상)
├── tests/harness.test.mjs                         # guard, verify, install, 더블 다이아몬드 회귀 테스트
├── DESIGN.md, META_PROMPT.md, QA_PROMPT.md, CLAUDE.md, AGENTS.md
├── .claude/settings.json                          # 복사 설치용 Claude Code 훅 ($CLAUDE_PROJECT_DIR 절대 경로)
├── .claude/agents/                                # 3-Agent 정의
├── .codex/hooks.json                              # Codex PreToolUse, PostToolUse, Stop 훅
├── .gemini/settings.json                          # Gemini BeforeTool, AfterAgent 훅
├── .agents/skills/
│   ├── x2-v5-console-harness/                     # 이식 파이프라인, guard, verify, 공통 설정 로더
│   ├── design-double-diamond/                     # 라운드별 선호 질문, HTML 시안 생성, 결정 기록
│   ├── impeccable-anti-slop/, apple-design-system/, ui-ux-component-architecture/
└── reference/
    ├── physicalworks_v5.css                       # 이식 가능한 v5 토큰, 레일 물리, Hairline Bento
    ├── x2-app-overrides.css                       # X2 콘솔 전용 규칙 (이식 대상 아님)
    ├── console.css                                # 기본 레이아웃 골격
    ├── console.html                               # 단독 실행 레퍼런스 셸 (nav 예시, .segmented 예시)
    └── nav-hover-contract.js                      # Escape 해제, 모바일 포커스 트랩, 테마, 200% 확대 동기화
```
