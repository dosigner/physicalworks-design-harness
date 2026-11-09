---
name: X2 Console Design System (Geist × PhysicalWorks v5 & Left Hover-Rail Architecture)
description: Vercel Geist의 무채색 고밀도 콘솔 감성, PhysicalWorks v5 브랜드 포인트, 상단 Status 전용 + 좌측 아이콘 레일(64px ↔ 240px) 단일 내비게이션 아키텍처, 감쇠 스프링 물리, 로보틱스 텔레메트리 정직성 규율을 결합한 표준 디자인 시스템 (Light & Dark 듀얼 테마)
theme_modes:
  default: "system (prefers-color-scheme) with manual override (#themeToggle, localStorage: x2_console_theme)"
  attribute: 'html[data-theme="light" | "dark"] (:root defaults to light, :root[data-theme="dark"] overrides dark)'
navigation_architecture:
  top_header_role: "Strictly Brand Identity (.brand) + Global Telemetry/Connection Status (#connectButton, .status-summary) + Theme Toggle (#themeToggle). NO route navigation or menu links allowed in top bars."
  left_rail_role: "Single Source of Navigation (aside#navigation). All page routes, module switchers, and top-level menus MUST reside in the 64px ↔ 240px hover-reveal left rail."
  local_view_switcher_role: "In-panel view switches (e.g. 2D/3D, Editor/Executions) MUST use compact .segmented controls inside .panel-head or .toolbar, never a secondary top nav bar."
colors:
  light:
    canvas: "#fafafa"
    sidebar: "#ffffff"
    surface: "#ffffff"
    surface-raised: "#f2f2f2"
    inset: "#fafafa"
    table-header: "#fafafa"
    border-subtle: "#e5e5e5"
    border: "#8f8f8f"
    divider: "#ebebeb"
    text: "#171717"
    text-secondary: "#666666"
    interactive: "#171717"
    interactive-hover: "#383838"
    on-interactive: "#ffffff"
    focus: "#005bc4"
    status-normal: "#17693a"
    status-normal-bg: "#def9ea"
    status-warning: "#815000"
    status-warning-bg: "#fff2cc"
    status-abnormal: "#b42328"
    status-abnormal-bg: "#fce8e8"
    status-offline: "#666666"
    status-offline-bg: "#f2f2f2"
    chart-p50: "#1757a6"
    chart-p90: "#5b45c9"
    chart-p99: "#a3367e"
  dark:
    canvas: "#0a0a0a"
    sidebar: "#0a0a0a"
    surface: "#0a0a0a"
    surface-raised: "#1a1a1a"
    inset: "#111111"
    table-header: "#111111"
    border-subtle: "#2e2e2e"
    border: "#666666"
    divider: "#222222"
    text: "#ededed"
    text-secondary: "#a1a1a1"
    interactive: "#ededed"
    interactive-hover: "#cccccc"
    on-interactive: "#0a0a0a"
    focus: "#68a8ff"
    status-normal: "#72df9b"
    status-normal-bg: "#123320"
    status-warning: "#ffca62"
    status-warning-bg: "#3c2b0a"
    status-abnormal: "#ff9999"
    status-abnormal-bg: "#411b1b"
    status-offline: "#a1a1a1"
    status-offline-bg: "#1a1a1a"
    chart-p50: "#77b8ff"
    chart-p90: "#9d8cf2"
    chart-p99: "#e98ac9"
  brand:
    gradient-spectrum: "linear-gradient(90deg, #27B9E9 0%, #7854FF 50%, #DB69F1 100%)"
    cyan: "#27B9E9"
    violet: "#7854FF"
    magenta: "#DB69F1"
    danger-estop: "#A50034"
    danger-estop-hover: "#7A0026"
typography:
  sans: '"Geist Sans", "Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  mono: '"Geist Mono", ui-monospace, "SFMono-Regular", Consolas, monospace'
  numeric-discipline: "font-variant-numeric: tabular-nums; font-feature-settings: 'zero' 1"
  scale:
    page-title-h1: "28px (1.75rem) / weight 500 / line-height 1.3 / tracking -0.01em"
    metric-kpi: "24px~26px / weight 500 / line-height 1.3 / tracking -0.02em / tabular-nums"
    brand-wordmark: "17px / weight 600 / tracking -0.02em"
    panel-title-h2: "16px (1rem) / weight 500 / line-height 1.4"
    body: "14px (0.875rem) / weight 400 / line-height 1.5"
    control-nav: "13px (0.8125rem) / weight 500 / line-height 18px"
    caption-table-th-tag: "12px (0.75rem) / weight 400~500 / line-height 1.5 (일부 고밀도 label/legend/tag 11px 허용)"
rounded:
  segment-item: "4px"
  control-sm: "6px"
  catalog-md: "8px"
  keycap: "9px"
  panel-lg: "12px"
  pill: "9999px"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-5: "24px"
  space-6: "32px"
  space-7: "48px"
components:
  app-header:
    minHeight: "4rem (64px)"
    background: "var(--v5-canvas)"
    borderBottom: "1px solid var(--v5-border-subtle)"
    allowedChildren: "Brand (.brand) + Status Trigger (#connectButton) + Theme Toggle (#themeToggle) + Mobile Toggle (#navToggle)"
  navigation-rail:
    collapsedWidth: "64px"
    expandedWidthDesktop: "240px"
    expandedWidthCompactDesktop: "200px (700px~959px)"
    borderRight: "1px solid var(--v5-border-subtle)"
    hoverBufferRight: "12px (.navigation::after)"
    openSpring: "330ms linear(0, .251, .618, .864, .98, 1.016, 1.019, 1.012, 1.005, 1.001, 1)"
    closeCurve: "230ms cubic-bezier(.25, .75, .28, 1) 100ms"
    activeIndicator: "3px × 22px left bar (var(--v5-interactive))"
  panel:
    background: "var(--v5-surface)"
    border: "1px solid var(--v5-border-subtle)"
    borderRadius: "12px"
    boxShadow: "none"
  icons:
    source: "https://lucide.dev/icons/ (Lucide Icons Official SVG)"
    spriteIdPrefix: "#x2-lucide-<icon-name>"
    viewBox: "0 0 24 24"
    size: "18px × 18px"
    stroke: "currentColor"
    strokeWidth: "1.5"
    strokeLinecap: "round"
    strokeLinejoin: "round"
    fill: "none"
  button-primary:
    minHeight: "44px"
    borderRadius: "6px"
    background: "var(--v5-interactive)"
    color: "var(--v5-on-interactive)"
    hoverBackground: "var(--v5-interactive-hover)"
    transform: "none"
  button-secondary:
    minHeight: "44px"
    borderRadius: "6px"
    background: "var(--v5-surface)"
    border: "1px solid var(--v5-border)"
    color: "var(--v5-text)"
    hoverBackground: "var(--v5-surface-raised)"
---

# X2 Console 표준 디자인 시스템 (Geist × PhysicalWorks v5 & 좌측 Hover 레일 아키텍처)

본 문서는 X2 관제·실험 콘솔 및 타 플랫폼 이식을 위한 **단일 규범적(normative) 디자인 시스템 명세서**다. 이전 세대(Carbon 파란색 버튼, Forge 청록 그라데이션 버튼, Astryx 개별 팔레트, 상단 GNB 탭 등)의 상충되는 레거시 규칙을 모두 제거하고, **Geist 무채색 고밀도 콘솔 + PhysicalWorks v5 브랜드 포인트 + 상단 Status 전용 / 좌측 Hover 스프링 내비게이션 단일화 아키텍처**로 일원화한다.

---

## 1. Overview (디자인 철학 및 핵심 아키텍처 5대 원칙)

### 1.1 Creative North Star: Zero-Chroma High-Craft Robotics Console
1. **내비게이션 단일화 원칙 (Top = Status Only, Left Rail = All Navigation)**:
   - **상단 영역(`.app-header` + `.context-bar`)에는 오직 브랜드 식별과 실시간 상태(Status) 관련 요소만 배치**한다.
   - 기존 화면이나 이식 대상 플랫폼의 상단에 내비게이션 메뉴(Top GNB, 라우트 탭, 페이지 전환 링크, 워크스페이스 드롭다운)가 있다면 **상태(Status) 표시만 상단에 남기고 모든 내비게이션 항목을 좌측 내비게이션 바(`aside#navigation`)로 이관**한다.
   - 이로써 상·하단 크롬에 의한 수직 뷰포트 잠식을 막고, 사용자의 탐색 동선을 **좌측 `64px ↔ 240px` Hover 레일 하나로 완전 통일**한다.
2. **무채색 뉴트럴 표면 위계 (Zero-Chroma Surface Layering)**:
   - 채도(파란색·남색·청록 기운)를 뺀 순수 무채색 명도 단계와 `1px` 구분선으로만 시각 위계를 구축한다.
   - 라이트(`#fafafa` / `#ffffff` / `#f2f2f2`)와 다크(`#0a0a0a` / `#111111` / `#1a1a1a`) 모두 **3단계 표면(Canvas/Surface → Inset → Raised)**을 엄격히 구분하여 그림자 없이도 명확한 공간 깊이를 만든다.
3. **Flat Bento & 무그림자 원칙 (Zero-Shadow Panels & 1px Hairline Bento)**:
   - 일반 패널(`.panel`)은 `box-shadow: none`, `border: 1px solid var(--border)`, `border-radius: 12px`만 사용한다.
   - 패널 내부에 또 테두리 카드를 중첩하지 않고, 컨테이너 배경을 `var(--border)`로 둔 뒤 `gap: 1px` 그리드로 셀을 쪼개는 **1px Hairline Bento** 방식을 사용한다.
4. **좌측 아이콘 레일 ↔ 확장 사이드바 스프링 물리 (`64px` ↔ `240px`)**:
   - 데스크톱에서 기본 `64px` 아이콘 레일로 시작해 본문 가용 폭을 극대화하고, 마우스 Hover 또는 키보드 `:focus-visible` 진입 시 **약 2% 오버슈트를 가진 감쇠 스프링(`330ms linear(...)`)**으로 `240px`까지 펼쳐진다. 이때 사이드바가 본문을 덮지 않고 `.navigation`(`width`)과 `.app-body`(`margin-left`)가 1ms 오차 없이 함께 이동한다.
5. **관제 조작 안정성 및 수치 정직성 (Zero-Jitter Controls & Tabular Numerals)**:
   - 실시간 텔레메트리 폴링 중 숫자 폭 변화로 화면이 흔들리지 않도록 전 영역에 `font-variant-numeric: tabular-nums`를 강제하며, 버튼 Hover/Active 시 `transform` 이동이나 글로우 효과를 금지한다.

---

## 2. Colors & Gradient Rules (단일 시맨틱 토큰 및 그라데이션 규율)

### 2.1 단일 시맨틱 토큰 원칙 (Single Token Source of Truth)
특정 화면(카탈로그, 플로우, 실험실 등)마다 별도의 로컬 회색/보더 팔레트(구 `--catalog-*`, `--pw-*` 등)를 따로 정의하는 것을 금지한다. 모든 컴포넌트는 반드시 아래 `--v5-*` 토큰과 시맨틱 별칭만 참조해야 한다.

```css
:root {
  color-scheme: light;
  /* 3-Tier Neutral Surfaces */
  --v5-canvas: #fafafa;
  --v5-sidebar: #ffffff;
  --v5-surface: #ffffff;
  --v5-inset: #fafafa;
  --v5-table-header: #fafafa;
  --v5-surface-raised: #f2f2f2;

  /* Borders & Dividers (1px Hairline vs WCAG 3:1 Control Border) */
  --v5-border-subtle: #e5e5e5;
  --v5-border: #8f8f8f;
  --v5-divider: #ebebeb;

  /* Typography Ink */
  --v5-text: #171717;
  --v5-text-secondary: #666666;

  /* Interactive & Focus */
  --v5-interactive: var(--v5-text);          /* #171717 */
  --v5-interactive-hover: #383838;
  --v5-on-interactive: var(--v5-surface);    /* #ffffff */
  --v5-focus: #005bc4;

  /* Semantic Status (WCAG 2.2 AA 4.5:1+ verified) */
  --v5-status-normal: #17693a;
  --v5-status-normal-bg: #def9ea;
  --v5-status-warning: #815000;
  --v5-status-warning-bg: #fff2cc;
  --v5-status-abnormal: #b42328;
  --v5-status-abnormal-bg: #fce8e8;
  --v5-status-offline: var(--v5-text-secondary);
  --v5-status-offline-bg: var(--v5-surface-raised);

  /* Telemetry & Chart Series */
  --v5-chart-p50: #1757a6;
  --v5-chart-p90: #5b45c9;
  --v5-chart-p99: #a3367e;

  /* Radii, Motion & Overlay Elevation */
  --geist-control-radius: 6px;
  --geist-menu-radius: 12px;
  --geist-menu-shadow: 0 1px 2px #0000000a, 0 5px 12px #00000014, 0 12px 28px #0000001c;
  --geist-toast-shadow: 0 2px 4px #0000000d, 0 8px 24px #0000001c;
  --ease-out-quart: cubic-bezier(.25, 1, .5, 1);
  --app-header-height: 4rem;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  /* 3-Tier Dark Surfaces: #0a0a0a (Base) -> #111111 (Inset/Header) -> #1a1a1a (Raised/Hover) */
  --v5-canvas: #0a0a0a;
  --v5-sidebar: #0a0a0a;
  --v5-surface: #0a0a0a;
  --v5-inset: #111111;
  --v5-table-header: #111111;
  --v5-surface-raised: #1a1a1a;

  --v5-border-subtle: #2e2e2e;
  --v5-border: #666666;
  --v5-divider: #222222;

  --v5-text: #ededed;
  --v5-text-secondary: #a1a1a1;

  --v5-interactive: var(--v5-text);          /* #ededed */
  --v5-interactive-hover: #cccccc;
  --v5-on-interactive: var(--v5-surface);    /* #0a0a0a */
  --v5-focus: #68a8ff;

  --v5-status-normal: #72df9b;
  --v5-status-normal-bg: #123320;
  --v5-status-warning: #ffca62;
  --v5-status-warning-bg: #3c2b0a;
  --v5-status-abnormal: #ff9999;
  --v5-status-abnormal-bg: #411b1b;

  --v5-chart-p50: #77b8ff;
  --v5-chart-p90: #9d8cf2;
  --v5-chart-p99: #e98ac9;
}

/* Unified Semantic Aliases */
html[data-theme], :root {
  --background: var(--v5-canvas);
  --surface: var(--v5-surface);
  --surface-header: var(--v5-table-header);
  --surface-subtle: var(--v5-surface-raised);
  --surface-selected: var(--v5-surface-raised);
  --layer: var(--v5-surface);
  --layer-hover: var(--v5-surface-raised);
  --layer-selected: var(--v5-surface-raised);
  --text: var(--v5-text);
  --secondary: var(--v5-text-secondary);
  --muted: var(--v5-text-secondary);
  --border: var(--v5-border-subtle);
  --border-strong: var(--v5-border);
  --blue: var(--v5-interactive);
  --blue-hover: var(--v5-interactive-hover);
  --blue-light: var(--v5-surface-raised);
  --focus: var(--v5-focus);
  --success: var(--v5-status-normal);
  --success-light: var(--v5-status-normal-bg);
  --warning: var(--v5-status-warning);
  --warning-light: var(--v5-status-warning-bg);
  --error: var(--v5-status-abnormal);
  --error-light: var(--v5-status-abnormal-bg);
  --past: var(--v5-text-secondary);
  --plot-point: var(--v5-chart-p50);
  --plot-line: var(--v5-chart-p50);
  --plot-candidate: var(--v5-chart-p90);
}
```

### 2.2 다크 모드 3단계 표면 분리 규율 (Dark Surface Hierarchy)
다크 모드에서 배경(`--v5-canvas: #0a0a0a`)과 기본 패널(`--v5-surface: #0a0a0a`)이 동일한 깊이를 가지므로, 시각적으로 영역이 뭉개지지 않게 아래 3가지를 반드시 지킨다:
1. **사이드바·패널 경계**: `.navigation` 우측(`border-right: 1px solid var(--border)`)과 `.panel` 외곽(`border: 1px solid var(--border)`)에 `#2e2e2e` 1px 헤어라인을 반드시 유지한다.
2. **중간 깊이 (`--v5-inset: #111111`)**: 테이블 헤더(`th`), 세그먼트 컨트롤 트랙(`.segmented`), 코드 블록(`pre`), 입력 웰(well)에는 `#111111`을 적용해 기본 `#0a0a0a` 표면과 구분한다.
3. **상승 표면 (`--v5-surface-raised: #1a1a1a`)**: 활성 내비게이션 탭(`[aria-current="page"]`), 테이블 행 Hover(`tbody tr:hover`), Secondary 버튼 Hover, 비활성 버튼 배경, 모달(`dialog`)에는 `#1a1a1a`를 적용한다.

### 2.3 그라데이션 규율 (Brand Spectrum & Continuous Data Gradient)
1. **PhysicalWorks 브랜드 그라데이션**:
   - **정의**: `linear-gradient(90deg, #27B9E9 0%, #7854FF 50%, #DB69F1 100%)`
   - **엄격 제한 허용 위치**:
     - 상단 헤더 브랜드 마크(`.pw-v5-mark`)
     - 이동 제어 중앙의 정적 X2 기체 실루엣 외곽선 SVG(`#x2-ultra-brand-spectrum`)
     - AI/TTS 생성 진행 바(`.touch-tts-generating`: `24×5px`, `background-size: 200% 100%`, `1.4s linear infinite`)
     - 공통 SVG 스프라이트 그라데이션 정의(`#x2-nav-icon-gradient`)
   - **절대 금지 위치**: 일반 버튼(`.button`), 카드/패널 배경, 보더, 일반 텍스트, 상태 배지(`.tag`)에는 **절대 그라데이션을 쓰지 않는다.**
2. **연속 데이터 그라데이션 (배터리 HSL 수식)**:
   - 배터리 잔량(`--battery-level: 0~100`)은 아래 수식으로 Red(`<=20`) → Orange(`30`) → Yellow(`50`) → Lime(`70`) → Green(`100`) 색상을 연속 인코딩한다.
   ```css
   :root { --battery-saturation: 72%; --battery-lightness: 42%; --battery-unknown: var(--v5-text-secondary); }
   :root[data-theme="dark"] { --battery-saturation: 72%; --battery-lightness: 62%; }
   .connection-battery, .battery-widget {
     --battery-hue: calc(
       clamp(0, (var(--battery-level, 20) - 20) * 3, 30) +
       clamp(0, (var(--battery-level, 20) - 30) * 1.5, 60) +
       clamp(0, var(--battery-level, 20) - 70, 30)
     );
     --battery-color: var(--battery-unknown);
   }
   .connection-battery:is([data-state=ok],[data-state=warning],[data-state=low]),
   .battery-widget:is([data-state=ok],[data-state=warning],[data-state=low]) {
     --battery-color: hsl(var(--battery-hue) var(--battery-saturation) var(--battery-lightness));
   }
   ```

---

## 3. Typography & Numeric Discipline (타이포그래피 및 수치 규율)

### 3.1 폰트 스택 (Local Variable Font First)
외부 웹폰트 CDN 요청을 금지하고 로컬 가변 폰트(`Geist Sans`, `Geist Mono`)와 한글 시스템/프리텐다드 폴백을 결합한다.

```css
@font-face {
  font-family: "Geist Sans";
  src: url('/geist-assets/Geist-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
@font-face {
  font-family: "Geist Mono";
  src: url('/geist-assets/GeistMono-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
:root {
  --font-sans: "Geist Sans", "Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "Geist Mono", ui-monospace, "SFMono-Regular", Consolas, monospace;
}
```

### 3.2 타이포그래피 위계 스케일

| 역할 | 선택자 / 요소 | 크기 | 굵기 | 행간 / 자간 | 규칙 |
| --- | --- | --- | --- | --- | --- |
| 페이지 제목 (`h1`) | `.page-heading h1` | `28px` (`1.75rem`) | `500` | `1.3` / `-0.01em` | 뷰포트와 무관하게 `28px` 일관성 유지 |
| 핵심 KPI / 상태값 | `.current-state > strong`, `.camera-temperature-card strong` | `24px ~ 26px` | `500` | `1.3` / `-0.02em` | `--font-mono`, `tabular-nums` 필수 |
| 브랜드 워드마크 | `.brand .pw-v5-wordmark` | `17px` | `600` | `1.2` / `-0.02em` | `"PhysicalWorks"` 전용 |
| 패널 제목 (`h2`) | `.panel-head h2` | `16px` (`1rem`) | `500` | `1.4` / `0` | 패널 헤더 좌측 타이틀 |
| 소제목 (`h3`) | `h3`, `.session-status-group h3` | `16px` (`1rem`) | `500` | `1.4` / `0` | Bento 셀/그룹 소제목 |
| 본문 (Body) | `body`, `td` | `14px` (`0.875rem`) | `400` | `1.5` / `0` | 설명문 줄 길이 `60ch ~ 80ch` 제한 |
| 컨트롤 / 탐색 / 버튼 | `.button`, `.nav-link`, `.definition-list` | `13px` (`0.8125rem`) | `500` (비활성 탭 `400`) | `18px` / `0` | 모든 조작 컨트롤 표준 크기 |
| 캡션 / 표 헤더 / 태그 | `th`, `.tag`, `.panel-head p`, `small`, `pre` | `12px` (`0.75rem`) | `400` (`.tag` `500`) | `1.5` / `0` | 일부 고밀도 `label`/`legend`/`tag`는 `11px` 허용 |

### 3.3 수치 고정폭 (`tabular-nums`) 의무화
- `body`, `td`, `th`, `dd`, `.number`, `.connection-panel`, `.sensor-chip strong`, `.plot-meta`, `.plot-status` 등 숫자가 표시되는 모든 영역에 `font-variant-numeric: tabular-nums`를 강제한다.
- `code`, `.mono`, `.version`에는 `font-feature-settings: "zero" 1`을 적용한다.

---

## 4. Layout, Top-to-Left Navigation Migration & Responsive Shell

### 4.1 [핵심 설계 원칙] 상단 Status 전용 & 좌측 내비게이션 단일화 (Top-to-Left Migration Rule)
타 플랫폼을 이 디자인 시스템으로 포팅하거나 신규 화면을 설계할 때, **상단 영역과 좌측 사이드바의 역할을 절대 섞지 않는다.**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ .app-header (64px) : [Brand Lockup]                  [Status Popover] [Theme]│ ← 오직 Brand + Status만! (페이지 이동 링크 금지)
├──────────┬───────────────────────────────────────────────────────────────────┤
│          │ .context-bar (80px) : [수집 연결] [시스템] [동작 상태] [입력원] [잠금]│ ← 오직 실시간 Status 요약만!
│  aside   ├───────────────────────────────────────────────────────────────────┤
│  #nav    │ main#workspace (max-width: 1360px, padding: 28px 40px 36px)       │
│          │                                                                   │
│  64px    │  ┌─ .panel (12px radius, 1px border, zero shadow) ─────────────┐  │
│  Rail    │  │ .panel-head: [Title]            [.segmented 로컬 뷰 스위처] │  │
│   ↔      │  ├──────────────────────────────┬──────────────────────────────┤  │
│  240px   │  │ 1px Hairline Bento Cell 1    │ 1px Hairline Bento Cell 2    │  │
│  Hover   │  └──────────────────────────────┴──────────────────────────────┘  │
│  Spring  │                                                                   │
│          │                                                                   │
│ [Footer] │                                                                   │
└──────────┴───────────────────────────────────────────────────────────────────┘
```

1. **상단 헤더 (`.app-header`) = 브랜드 + 전역 연결 Status 전용**:
   - 좌측에는 `.brand`(마크 + 워드마크), 우측에는 `#connectButton`(SSH·상태·카메라·배터리 실시간 신호 + 클릭 시 `#connectionPanel` Popover 열기)과 `#themeToggle`만 배치한다.
   - **이식 규칙**: 기존 앱의 상단 헤더에 있던 모든 메뉴 링크(`Home`, `Dashboard`, `Settings`, `Logs`, `Experiments` 등)는 상단에서 즉시 제거하고 **좌측 `aside#navigation` 내부 `#navItems`로 옮긴다.**
2. **상단 컨텍스트 바 (`.context-bar`) = 로봇/시스템 Status 요약 전용**:
   - 현재 연결된 대상의 핵심 상태 지표(`.status-summary`)만 읽기 전용으로 나열한다.
   - 컨텍스트 바에 탭 바나 페이지 이동 메뉴를 넣지 않는다.
3. **좌측 내비게이션 레일 (`aside#navigation`) = 유일한 전역 탐색 바**:
   - 앱의 모든 최상위 라우트와 화면 이동은 오직 좌측 `#navItems`의 `.nav-link`(`18×18px` Lucide 아이콘 + `.nav-label`)를 통해서만 수행한다.
   - 환경 상태 점(`.status-dot`), 서버/수집기 상태 문구, 버전 정보는 좌측 레일 하단 `.nav-footer`에 배치한다.
4. **로컬 뷰 스위처 (`.segmented`) = 패널 헤더/툴바 내부 귀속**:
   - 한 라우트 안에서의 하위 뷰 전환(예: `2D` / `3D`, `Editor` / `Executions`, `실시간 지도` / `저장 지도`)은 페이지 상단에 전체 폭 탭 바를 만들지 않고, 해당 `.panel-head` 우측이나 `.toolbar` 내부에 컴팩트한 `.segmented` 컨트롤로 배치한다.

### 4.2 반응형 브레이크포인트 매트릭스

| 구간 | 좌측 내비게이션 (`#navigation`) | 본문 (`main#workspace`) & 컨텍스트 바 | 동작 방식 |
| --- | --- | --- | --- |
| `1100px 이상` | 기본 `64px` 레일 ↔ Hover 시 `240px` 스프링 확장 | `main` 패딩 `28px 40px 36px`, `.context-bar` 패딩 `16px 32px`, `.overview-grid` 2열(`1200px+`) | 표준 데스크톱 관제 |
| `960px ~ 1099px` | 기본 `64px` 레일 ↔ Hover 시 `240px` 확장 | `main` 패딩 `24px`, `.context-bar` 패딩 `16px 24px`, `.brand { min-width: 0 }` | 중형 데스크톱 여백 최적화 |
| `700px ~ 959px` | 기본 `64px` 레일 ↔ Hover 시 **`200px`** 확장 (터치 전용 기기는 `200px` 고정) | `.context-bar`는 `position: static` 전환, 2열 그리드 1열화 | 태블릿 가로 / 소형 랩탑 |
| `699px 이하` | `240px` 오프캔버스 Drawer (`transform: translateX(-100%)` ↔ `[data-open="true"]`) | `.app-body { margin-left: 0 }`, 상단 `#navToggle` 노출, `main` 패딩 `24px 16px` | 모바일 Drawer + 포커스 트랩 |

### 4.3 1px Hairline Bento 그리드 (No Card-in-Card)
패널(`.panel`) 내부에서 다수의 상태 그룹이나 차트를 나열할 때, 개별 카드에 `border`와 `border-radius`를 중복 부여하지 않는다. 그리드 배경을 `var(--border)`로 두고 `gap: 1px`로 셀을 분할한다.

```css
.panel {
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: none;
  background: var(--surface);
  overflow: hidden;
}
.bento-grid,
.session-status-grid,
.interaction-grid,
.power-groups,
.power-history-charts {
  display: grid;
  gap: 1px;
  padding: 0;
  background: var(--border);
}
.bento-cell,
.session-status-group,
.interaction-card,
.power-group,
.power-history-chart {
  border: 0;
  border-radius: 0;
  background: var(--surface);
  padding: 16px;
}
```

### 4.4 200% 텍스트 확대(`root font-size: 32px`) 및 `320px` Reflow 대응
- `.app-header`는 고정 `height` 대신 `min-height: var(--app-header-height)`(`4rem`)와 `height: auto`를 사용하여 텍스트가 줄바꿈되어도 잘리지 않게 한다.
- 줄바꿈으로 인해 실제 sticky 헤더/컨텍스트 바 높이가 커지면 `syncStickyOffsets()`가 측정된 높이를 `--app-header-height` 및 `scroll-padding-top`에 반영한다.

---

## 5. Elevation, Shapes & Hit Targets (표면 깊이, 곡률 4단계, 터치 타깃)

### 5.1 무그림자 원칙 & 오버레이 전용 그림자
- **모든 인라인 패널·카드·버튼·입력창**: `box-shadow: none`.
- **오버레이(떠 있는 레이어)에만 그림자 허용**:
  - 팝오버 메뉴 (`.connection-panel`, `.flow-menu-items`): `var(--geist-menu-shadow)`
  - 토스트 (`.console-toast`): `var(--geist-toast-shadow)`
  - 모달 (`dialog`): 라이트 `0 12px 32px rgba(0,0,0,.12)`, 다크 `0 12px 32px rgba(0,0,0,.5)`

### 5.2 곡률 체계 (`border-radius`)
- **`4px`**: `.segmented button` (세그먼트 내부 아이템)
- **`6px` (`--geist-control-radius`)**: `.button`, `.icon-button`, `.nav-link`, `input`, `select`, `textarea`, `.segmented` 트랙, `.console-toast`, `.pw-v5-mark`
- **`8px ~ 9px`**: 카탈로그/상체 보조 컨트롤(`8px`), 게임 키캡 방향 버튼(`.locomotion-direction-button`, `9px`)
- **`12px` (`--geist-menu-radius`)**: `.panel`, `dialog`, `.connection-panel`, `.locomotion-stage`
- **`9999px` (Pill)**: `input[type="search"]`, `.tag`, `.touch-tts-generating`

### 5.3 인체공학적 히트 타깃 (`44px` Minimum) & 포커스 링
- 모든 조작 버튼(`.button`), 아이콘 버튼(`.icon-button`), 내비게이션 항목(`.nav-link`), 입력창(`input`, `select`), `<summary>`는 최소 **`44px` 높이**를 보장한다.
- 작은 시각 요소(`.info-tip` `16×16px`, `.mc-mode-help-button` `24×24px`, 캔버스 포트)는 투명 히트 영역 확장(`::after`) 또는 `24px` 반경 스냅으로 포인터 조작 실수를 방지한다.
- 모든 포커스 가능 요소는 `:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px }` (`.nav-link`는 `-2px`)를 표시한다.

---

## 6. [핵심] Left Navigation Bar & Hover-Reveal Spring Physics (좌측 Nav 바 & Hover 확장 명세)

좌측 내비게이션 바(`aside#navigation`)와 **아이콘 레일(`64px`) ↔ 전체 사이드바(`240px`) Hover 확장 효과**는 본 디자인 시스템의 핵심 정체성이다. 타 플랫폼에 이식할 때 아래 **7가지 메커니즘**을 정확히 구현해야 아이콘 흔들림, 텍스트 줄바꿈, 경계선 떨림(jitter)이 발생하지 않는다.

### 6.1 7대 핵심 설계 메커니즘

1. **아이콘 중심축 고정 수학 (`8px + 15px + 18px + 15px + 8px = 64px`)**:
   - 접힌 레일 폭은 `64px`이다.
   - 내부 스크롤 컨테이너(`.nav-scroll`)에 `padding: 8px; overflow-x: hidden;`을 주어 내부 폭을 `48px`로 맞춘다.
   - 각 메뉴 링크(`.nav-link`)는 `padding-inline: 15px`를 가진다.
   - `15px(좌) + 18px(SVG 아이콘) + 15px(우) = 48px`이 되어, 접혔을 때는 `48×44px` 버튼 정중앙에 아이콘이 위치하고, `240px`로 펼쳐질 때도 **아이콘의 X좌표(좌측 끝 `23px`, 중심 `32px`)가 1px도 이동하지 않은 채** 오른쪽으로 라벨만 자연스럽게 드러난다.
2. **`body:has()` 기반 단일 상태 머신 & 본문 동시 밀어내기 (Zero-Overlap Lockstep)**:
   - 사이드바가 본문을 덮는 오버레이 방식이 아니라, `body`에서 `--nav-width`와 `--nav-motion` 변수를 제어하여 `.navigation`(`width`), `.app-body`(`margin-left`), 하단 고정 바(`left`)의 경계선이 **1ms의 오차도 없이 동일한 스프링 곡선으로 함께 이동**한다.
   - 마우스 `:hover`뿐 아니라 키보드 탭 탐색(`:focus-visible`) 진입 시에도 동일하게 펼쳐진다.
3. **열림(감쇠 스프링) vs 닫힘(유예 시간 + 부드러운 감속)의 비대칭 물리**:
   - **열림 (Open)**: `330ms` 동안 약 **2% 오버슈트(overshoot)**가 있는 샘플링 감쇠 스프링 `linear(0, .251, .618, .864, .98, 1.016, 1.019, 1.012, 1.005, 1.001, 1)`(폴백 `cubic-bezier(.22, .85, .28, 1.04)`)로 탄성 있게 열린다.
   - **닫힘 (Close)**: 포인터가 실수로 살짝 벗어났을 때 바로 닫히지 않도록 **`100ms` 닫힘 지연(`--nav-close-delay: 100ms`)**을 둔 뒤, 오버슈트 없는 `230ms cubic-bezier(.25, .75, .28, 1)`로 차분하게 수축한다.
4. **우측 `12px` 투명 포인터 완충 지대 (`.navigation::after`)**:
   - `.navigation::after { content: ""; position: absolute; inset-block: 0; left: 100%; width: 12px; }`
   - 사이드바 우측 바깥에 보이지 않는 `12px` 투명 히트 영역을 부착하여 경계선 부근에서 마우스가 움직일 때 열렸다 닫혔다 떨리는 현상(hover jitter)을 원천 차단한다.
5. **텍스트 줄바꿈 원천 차단(Pre-sized Box) + 2단 스태거(Stagger) 페이드인**:
   - 사이드바 폭이 커지는 도중 글자가 줄바꿈되지 않도록 `.nav-label`은 처음부터 펼쳐진 폭 기준 크기(`max-width: calc(var(--nav-expanded-width) - 76px); white-space: nowrap;`)를 유지하고, `.nav-footer`도 `width: calc(var(--nav-expanded-width) - 16px)`로 고정한다.
   - 접힌 상태에서는 `opacity: 0; translate: -5px 0;`으로 숨겨져 있다가, 열리기 시작한 뒤 `55ms` 딜레이를 두고 왼쪽에서 오른쪽(`translate: 0 0`, `165ms` / `210ms`)으로 따라 들어온다.
6. **활성 탭 좌측 `3px` 단색 인디케이터, 접힌 레일 상태 배지 & 클릭 텐션**:
   - 현재 활성 페이지(`.nav-link[aria-current="page"]`)는 `--v5-surface-raised` 배경 + `font-weight: 500` + 좌측 중앙 `3px × 22px` 단색 수직 바(`::before { left: 0; top: 11px; bottom: 11px; width: 3px; border-radius: 2px; background: var(--v5-interactive); }`)를 표시한다.
   - 백그라운드 실행 중 표시 점(`.nav-link[data-active="true"]::after`, `7×7px` 원형)은 접힌 `64px` 상태에서도 아이콘 우상단(`position: absolute; left: 32px; top: 8px;`)에 고정되어 레일이 닫혀 있어도 즉시 상태를 식별할 수 있다.
   - 메뉴 클릭 시(`.nav-link:active svg`) 아이콘이 `130ms var(--ease-out-quart)` 동안 `scale: 0.96`으로 눌리는 물리적 텐션을 준다.
7. **`Escape` 즉시 접기 & 재진입 해제 계약 (`data-hover-dismissed`)**:
   - 포인터가 사이드바 위에 있더라도 사용자가 `Escape` 키를 누르면 `navSidebar.dataset.hoverDismissed = 'true'`가 설정되어 `100ms` 딜레이 없이(`--nav-close-delay: 0ms`) 즉시 `64px`로 접힌다.
   - 이후 마우스가 다시 들어오거나(`pointerenter`) 포커스가 이동하면(`focusin`) `data-hover-dismissed` 속성을 제거해 다시 Hover 확장이 작동하게 만든다.

### 6.2 Left Navigation 표준 DOM 구조

```html
<aside class="navigation" id="navigation" aria-label="주 탐색">
  <div class="nav-scroll">
    <nav id="navItems">
      <a class="nav-link" href="#overview" data-route="overview" aria-current="page">
        <svg viewBox="0 0 24 24" class="lucide-icon" aria-hidden="true" focusable="false">
          <use href="#x2-lucide-layout-dashboard"></use>
        </svg>
        <span class="nav-label">운용 개요</span>
      </a>
      <!-- 상단 헤더에 있던 모든 내비게이션 메뉴를 이 목록(.nav-link)으로 통합 -->
    </nav>
    <div class="nav-footer">
      <span class="status-dot"></span>
      <strong id="environmentLabel">서버 확인 중</strong>
      <p id="collectorStatus">실기기 수신 상태 확인 중</p>
      <span class="version">Console 0.1.0 / AimDK 1.0.0 기준</span>
    </div>
  </div>
</aside>
```

### 6.3 Left Navigation & Hover Spring 드롭인 CSS 원문

```css
.navigation {
  position: fixed;
  top: var(--app-header-height);
  bottom: 0;
  width: 240px;
  background: var(--v5-sidebar);
  border-right: 1px solid var(--border);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  z-index: 25;
}
.nav-scroll {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
}
.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  margin: 2px 0;
  padding: 10px 12px;
  border: 0;
  border-radius: var(--geist-control-radius); /* 6px */
  font-size: 13px;
  color: var(--secondary);
  text-decoration: none;
}
.nav-link svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  stroke-width: 1.5;
}
.nav-link:hover {
  background: var(--background);
  color: var(--text);
}
.nav-link[aria-current="page"] {
  background: var(--v5-surface-raised);
  color: var(--text);
  font-weight: 500;
}
.nav-link[aria-current="page"]::before {
  content: "";
  position: absolute;
  left: 0;
  top: 11px;
  bottom: 11px;
  width: 3px;
  border-radius: 2px;
  background-color: var(--v5-interactive);
}
.nav-link[data-active="true"]::after {
  content: "";
  width: 7px;
  height: 7px;
  background: var(--v5-interactive);
  border-radius: 50%;
  margin-left: auto;
  flex: none;
}
.nav-footer {
  margin-top: auto;
  padding: 20px 12px;
  border-top: 1px solid var(--border);
  color: var(--secondary);
  font-size: 12px;
}
.app-body {
  margin-left: 240px;
}

@media (min-width: 700px) and (max-width: 959px) {
  .navigation { width: 200px; }
  .app-body { margin-left: 200px; }
}

@media (min-width: 700px) and (hover: hover) and (pointer: fine) {
  body {
    --nav-expanded-width: 240px;
    --nav-width: 64px;
    --nav-close-delay: 100ms;
    --nav-spring: cubic-bezier(.22, .85, .28, 1.04);
    --nav-motion: 230ms cubic-bezier(.25, .75, .28, 1) var(--nav-close-delay);
  }
  @supports (transition-timing-function: linear(0, 1)) {
    /* 약 2% 오버슈트를 가진 감쇠 스프링 */
    body {
      --nav-spring: linear(0, .251, .618, .864, .98, 1.016, 1.019, 1.012, 1.005, 1.001, 1);
    }
  }
  body:has(.navigation:not([data-hover-dismissed]):hover, .navigation:not([data-hover-dismissed]) :focus-visible) {
    --nav-width: var(--nav-expanded-width);
    --nav-motion: 330ms var(--nav-spring);
  }
  body:has(.navigation[data-hover-dismissed]) {
    --nav-close-delay: 0ms;
  }
  /* 사이드바와 본문 경계가 1ms 오차 없이 동일 타이밍으로 이동 */
  .navigation {
    width: var(--nav-width);
    padding: 0;
    overflow: visible;
    transition: width var(--nav-motion);
  }
  .app-body {
    margin-left: var(--nav-width);
    transition: margin-left var(--nav-motion);
  }
  /* 우측 12px 투명 포인터 완충 지대 */
  .navigation::after {
    content: "";
    position: absolute;
    inset-block: 0;
    left: 100%;
    width: 12px;
  }
  /* 8px + 15px + 18px + 15px + 8px = 64px 아이콘 중심축 고정 */
  .nav-scroll {
    padding: 8px;
    overflow-x: hidden;
  }
  .navigation .nav-link {
    padding-inline: 15px;
  }
  .navigation .nav-link svg {
    flex: none;
    transition: scale 130ms var(--ease-out-quart);
  }
  .navigation .nav-link:active svg {
    scale: .96;
  }
  .navigation .nav-link:focus-visible {
    outline-offset: -2px;
  }
  /* 라벨 및 푸터 스태거 트랜지션 */
  .navigation .nav-label,
  .navigation .nav-footer {
    opacity: 0;
    translate: -5px 0;
    transition: opacity 110ms ease-out 65ms, translate 160ms var(--ease-out-quart) 65ms;
  }
  .navigation .nav-label {
    flex: none;
    max-width: calc(var(--nav-expanded-width) - 76px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .navigation .nav-footer {
    width: calc(var(--nav-expanded-width) - 16px);
  }
  .navigation:not([data-hover-dismissed]):is(:hover, :has(:focus-visible)) :is(.nav-label, .nav-footer) {
    opacity: 1;
    translate: 0 0;
    transition-duration: 165ms, 210ms;
    transition-delay: 55ms;
  }
  .navigation[data-hover-dismissed] :is(.nav-label, .nav-footer) {
    transition-delay: 0ms;
  }
  .navigation .nav-link[data-active="true"]::after {
    position: absolute;
    left: 32px;
    top: 8px;
    margin: 0;
  }
}
@media (min-width: 700px) and (max-width: 959px) and (hover: hover) and (pointer: fine) {
  body {
    --nav-expanded-width: 200px;
  }
}
```

### 6.4 Left Navigation 드롭인 JS 계약 (`Escape` 즉시 닫기 & 모바일 포커스 트랩)

```javascript
const desktopHoverNavigation = window.matchMedia('(min-width: 700px) and (hover: hover) and (pointer: fine)');
const navSidebar = document.getElementById('navigation');
const navToggle = document.getElementById('navToggle');

const allowSidebarReveal = () => {
  delete navSidebar.dataset.hoverDismissed;
};
navSidebar.addEventListener('pointerenter', allowSidebarReveal);
navSidebar.addEventListener('focusin', allowSidebarReveal);

document.addEventListener('keydown', (e) => {
  // 데스크톱 Hover 상태에서 Escape 입력 시 딜레이 없이 즉시 64px 레일로 접기
  if (e.key === 'Escape' && desktopHoverNavigation.matches && navSidebar.matches(':hover, :has(:focus-visible)')) {
    navSidebar.dataset.hoverDismissed = 'true';
  }
  // 모바일 Drawer 열림 상태에서 Escape 및 Tab 포커스 순환 트랩
  if (navSidebar.dataset.open !== 'true') return;
  if (e.key === 'Escape') {
    e.preventDefault();
    setMenu(false);
    navToggle?.focus();
    return;
  }
  if (e.key !== 'Tab') return;
  const links = navSidebar.querySelectorAll('#navItems a:not([hidden])');
  if (!links.length) return;
  const focused = document.activeElement;
  if (e.shiftKey && focused === navToggle) { e.preventDefault(); links[links.length - 1].focus(); }
  else if (!e.shiftKey && focused === links[links.length - 1]) { e.preventDefault(); navToggle.focus(); }
  else if (e.shiftKey && focused === links[0]) { e.preventDefault(); navToggle.focus(); }
  else if (!e.shiftKey && focused === navToggle) { e.preventDefault(); links[0].focus(); }
});
```

---

## 7. Components, Progressive Disclosure & SVG Icon System

### 7.1 버튼 시스템 (`.button`)
- **공통**: `min-height: 44px; border-radius: 6px; font-size: 13px; font-weight: 500; line-height: 18px; gap: 12px; box-shadow: none;`
- **Primary (`.button.primary` — 무채색 반전)**:
  - 배경 `var(--v5-interactive)`, 글자 `var(--v5-on-interactive)`, 보더 `var(--v5-interactive)`.
  - Hover: `background: var(--v5-interactive-hover); filter: none; transform: none; box-shadow: none;`
  - Active: `transform: none;`
- **Secondary / Ghost (`.button.secondary`, `.button.ghost`)**:
  - 배경 `var(--surface)`, 글자 `var(--text)`, 보더 `1px solid var(--border-strong)`.
  - Hover: `background: var(--v5-surface-raised); border-color: var(--border-strong); box-shadow: none;`
- **Danger / E-Stop (`.button.danger`)**:
  - 일반 위험 버튼: 배경 `var(--error-light)`, 글자 `var(--error)`, 보더 `var(--error)`.
  - 즉시 정지(E-Stop): 배경 `#A50034`, 글자 `#FFFFFF` (Hover `#7A0026`, 다크 모드 `2px solid var(--v5-status-abnormal)`).
- **Disabled (`.button:disabled`)**:
  - `background: var(--v5-surface-raised); color: var(--secondary); border-color: var(--border); opacity: 1; cursor: not-allowed;`

### 7.2 로컬 뷰 스위처 (`.segmented`) — 상단 서브 탭 대체 표준
화면 내부에서 보기 모드를 전환할 때는 상단 내비게이션 바와 혼동되는 풀와이드 탭 바 대신, 패널 헤더나 툴바 안에 `.segmented` 컨트롤을 배치한다.

```css
.segmented {
  display: inline-flex;
  flex-wrap: wrap;
  background: var(--v5-inset);
  border: 1px solid var(--border);
  border-radius: var(--geist-control-radius); /* 6px */
  padding: 3px;
}
.segmented button {
  min-height: 36px;
  padding: 6px 14px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--v5-text-secondary);
  font-size: 13px;
  font-weight: 500;
}
.segmented button:hover {
  color: var(--v5-text);
}
.segmented button[aria-pressed="true"],
.segmented button[aria-selected="true"] {
  background: var(--surface);
  color: var(--text);
  box-shadow: inset 0 0 0 1px var(--border-strong);
}
```

### 7.3 게임 키캡형 방향 패드 (`.locomotion-direction-button`)
- `min-height: 72px; width: 80px; border: 1px solid var(--border); border-bottom-width: 3px; border-radius: 9px; background: var(--surface);`
- 키 입력(`.locomotion-root[data-key-pressed=...]`) 시 키캡이 반전(`background: var(--text); color: var(--surface)`)되고 중앙 X2 Ultra 브랜드 그라데이션 실루엣(`.locomotion-outline-image`)이 이동/회전 방향(`translateX/Y(±4px)`, `rotate(±5deg)`, `120ms ease-out`)으로 반응한다.

### 7.4 점진적 노출 (Scoped Progressive Disclosure) & 오류 자동 펼침 규칙
- 복잡한 전이 도식(`#mcFsmDetails`), 출처 한계 안내(`#sourceNoticeDetails`), 과거 실행 기록(`.locomotion-records`, `.lab-legacy-records`)은 기본 접힘 `<details>`로 두어 첫 화면의 인지 부하를 줄인다.
- **폴링 상태 보존 & 오류 자동 노출**:
  - 주기 폴링 재렌더 시 사용자가 열어둔 `<details>` 상태와 키보드 포커스를 그대로 유지한다.
  - 단, 접힌 영역 내부에 **실행 차단 사유(`block-reason`), 통신 실패(`error`), 안전 복구 필요 상태**가 발생하면 해당 섹션은 접힌 영역 밖에 상시 노출하거나 즉시 자동 펼침(`open = true`) 처리한다.

### 7.5 상단 연결 상태 Popover (`#connectButton` & `#connectionPanel`)
- 상단 헤더 우측의 `#connectButton`은 SSH / 상태 데이터 / 카메라 신호(`.connection-circle`)와 연속 HSL 배터리 잔량(`.connection-battery`), 전체 상태 문구(`#connectionLabel`)를 상시 표시한다.
- 클릭 시 HTML native `popover="auto"` 기반의 비모달 `#connectionPanel`(`width: min(380px, calc(100vw - 32px))`, `border-radius: 12px`, `box-shadow: var(--geist-menu-shadow)`)을 여닫으며, API 조회 실패 시 이전 정상 표시를 유지하지 않고 즉시 `확인 불가(?)`로 전환한다.

### 7.6 브랜드 록업 (`.brand`) & Lucide SVG 아이콘 시스템 (`https://lucide.dev/icons/`)
- **브랜드 록업 (`.app-header .brand`)**:
  - 좌측 상단 `.pw-v5-mark`(`26×26px`, `border-radius: 6px`, `/physicalworks-brand.png`) + `.pw-v5-wordmark`(`17px`, `font-weight: 600`, `letter-spacing: -0.02em`, `"PhysicalWorks"`).
- **단일 아이콘 소스 원칙 (`https://lucide.dev/icons/`)**:
  - 좌측 내비게이션 레일(`.nav-link`), 버튼(`.button`, `.icon-button`), 상태 표시줄의 모든 벡터 아이콘은 반드시 **[Lucide Icons (`https://lucide.dev/icons/`)](https://lucide.dev/icons/)**에서 의미에 맞는 공식 아이콘 SVG(`viewBox="0 0 24 24"`)를 가져와 차용한다.
  - 이모지(🚀, ⚙️ 등), Filled 스타일 타 아이콘 팩, 또는 임의로 그린 비규격 SVG path를 섞어 쓰는 것을 엄격히 금지한다.
- **인라인 SVG 스프라이트 & 렌더링 규격 (`svg.console-icon-sprite`)**:
  - `<body>` 최상단 인라인 `<svg class="console-icon-sprite" width="0" height="0" aria-hidden="true" focusable="false"><defs>` 내부에 `<symbol id="x2-lucide-<name>" viewBox="0 0 24 24">`를 정의하고 `<use href="#x2-lucide-<name>"/>`로 참조한다.
  - **공통 CSS 규격**: `width: 18px; height: 18px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;`
  - **주요 메뉴/기능별 Lucide 아이콘 표준 매핑**:
    | 기능 / 메뉴 도메인 | Lucide 아이콘 이름 (`https://lucide.dev/icons/...`) | 심볼 ID |
    | --- | --- | --- |
    | 운용 개요 / 대시보드 | `layout-dashboard` | `#x2-lucide-layout-dashboard` |
    | 실시간 관측 / 텔레메트리 | `activity`, `list-video` | `#x2-lucide-activity`, `#x2-lucide-list-video` |
    | 공간 / 지도 / 점군 / SLAM | `map`, `locate-fixed`, `scan`, `route` | `#x2-lucide-map`, `#x2-lucide-locate-fixed`, `#x2-lucide-scan` |
    | 이동 제어 / 보행 / 상체 자세 | `move`, `person-standing`, `face-slightly-smiling` | `#x2-lucide-move`, `#x2-lucide-person-standing` |
    | 워크플로우 / 노드 에디터 | `workflow`, `split` | `#x2-lucide-workflow`, `#x2-lucide-split` |
    | 알고리즘 실험실 / 튜닝 | `flask-conical`, `sliders-horizontal` | `#x2-lucide-flask-conical`, `#x2-lucide-sliders-horizontal` |
    | 카탈로그 / 문서 / 로그 | `library`, `file-text`, `folder-open` | `#x2-lucide-library`, `#x2-lucide-file-text` |
    | 유틸리티 / 상태 / 테마 | `lock-keyhole`, `moon`, `refresh-cw`, `download`, `upload`, `chevron-down`, `menu`, `x` | `#x2-lucide-lock-keyhole`, `#x2-lucide-moon` 등 |
- **코드 스니펫 (Sprite 선언 및 `.nav-link` 차용 예시)**:
  ```html
  <!-- 1. body 최상단 공통 스프라이트에 Lucide(https://lucide.dev/icons/) 원문 path 등록 -->
  <svg xmlns="http://www.w3.org/2000/svg" class="console-icon-sprite" width="0" height="0" aria-hidden="true" focusable="false">
    <defs>
      <symbol id="x2-lucide-layout-dashboard" viewBox="0 0 24 24">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </symbol>
    </defs>
  </svg>

  <!-- 2. 좌측 내비게이션 또는 버튼에서 18x18px currentColor로 참조 -->
  <a class="nav-link" href="#overview" aria-current="page">
    <svg viewBox="0 0 24 24" class="lucide-icon" data-lucide="layout-dashboard" aria-hidden="true" focusable="false">
      <use href="#x2-lucide-layout-dashboard"></use>
    </svg>
    <span class="nav-label">운용 개요</span>
  </a>
  ```

---

## 8. Do's and Don'ts (아키텍처 규율 및 Anti-Slop 가드레일)

### Do (반드시 지킬 것)
- **상단 Nav → 좌측 Nav 이관**: 기존 화면이나 타 플랫폼 상단에 페이지/라우트 이동 메뉴가 있다면 **상단에는 Status(연결·배터리·시스템 요약·테마 토글)만 남기고, 모든 내비게이션 메뉴를 좌측 `64px ↔ 240px` Hover 확장 레일(`aside#navigation`)로 옮겨라.**
- **좌측 레일 7대 물리 법칙 준수**: `8 + 15 + 18 + 15 + 8 = 64px` 아이콘 중심축 고정, `body:has()` 본문 동시 이동, `330ms linear(...)` 감쇠 스프링 열림 vs `100ms` 딜레이 후 `230ms` 닫힘, 우측 `12px` 투명 포인터 버퍼(`.navigation::after`), 라벨 스태거(`55ms`), 좌측 `3px` 활성 바, `Escape` 즉시 닫기(`data-hover-dismissed`)를 세트로 구현하라.
- **무채색 3단계 표면 & 1px Hairline Bento**: 모든 컴포넌트 색상을 `--v5-*` 토큰으로 통일하고, 패널 내부 다중 카드 배치는 중첩 테두리 대신 `gap: 1px; background: var(--border)` Hairline Bento를 사용하라.
- **수치 고정폭 & 출처 정직성**: 모든 숫자와 테이블에 `font-variant-numeric: tabular-nums`를 적용하고, 실기기 수신 / 과거 replay / 합성 fixture 여부와 `age_s`를 텍스트로 명시하라.

### Don't (절대 하지 말 것 — 과감히 제거할 대상)
- **상단 중복 내비게이션 금지 (No Top Nav Links)**: `.app-header`나 `.context-bar`에 라우트 탭, 드롭다운 메뉴, 브레드크럼, 페이지 이동 링크를 두지 마라.
- **파편화된 서브 팔레트 금지 (No Fragmented Local Palettes)**: 특정 화면에만 쓰이는 별도 회색/파란색 변수(구 `--catalog-*`, Carbon `#0f62fe`, Forge `#409BAD` 등)를 남기지 말고 `--v5-*` 토큰으로 완전히 대체하라.
- **장식용 그라데이션·그림자·중첩 카드 금지 (No AI Slop)**:
  - Primary 버튼이나 패널 배경에 보라/파랑/청록 그라데이션이나 글로우(`box-shadow`)를 넣지 마라.
  - 카드 안에 또 카드를 중첩하거나, 둥근 카드(`border-radius: 12px`)에 두꺼운 컬러 왼쪽 테두리(`border-left: 4px solid ...`)를 넣지 마라.
  - 버튼 Hover/Active 시 `transform: translateY(-1px)`나 과장된 바운스 이징(`cubic-bezier(.34, 1.56, .64, 1)`)을 쓰지 마라.
- **데이터·안전 왜곡 금지**: 미수신 값을 `0`으로 채우거나, 제조사 상태명 `SAFE`나 3D URDF 렌더링을 실제 로봇의 물리적 안전이나 하드웨어 동작 완료 증거로 표시하지 마라.
