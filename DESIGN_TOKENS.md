# Design Tokens — Yunseo Portfolio

> **ARCHIVING THE ART OF DESIGN**  
> 관찰하고, 탐색하고, 구현하는 과정을 기록하는 개인 포트폴리오.

이 문서는 UI 디자인과 CSS 구현에 공통으로 적용할 **현재 제공된 Figma 시안의 컬러 기준**입니다. 이미지에서 확인 가능한 색은 시안의 픽셀을 기준으로 기록하고, 구분이 어려운 세부 색은 같은 톤에서만 보조적으로 설정합니다.

## 1. Visual Direction

- **Keywords:** Archive / Paper / Hand-drawn / Soft Sky Blue / Ivory
- **Principle:** 작품의 가독성을 우선하고, 종이 질감·스케치·테이프는 보조 요소로 사용합니다.
- **Mood:** 사용자가 선택한 연한 스카이블루와 아이보리, 블루그레이 손글씨의 부드러운 아카이브 분위기

## 2. Color — 현재 시안 기준

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#FAF8F3` | INTRO·ABOUT·APPROACH 등 기본 아이보리 배경 (시안 픽셀 색상) |
| `--color-surface` | `#FFFFFF` | 종이 카드와 화이트 표면 |
| `--color-paper` | `#FFFFFF` | 종이 카드 본체 |
| `--color-hero` | `#DCE5EB` | 상단 스카이블루 히어로 배경 (시안 픽셀 색상) |
| `--color-tape` | `#B9CAD5` | 종이 위 블루그레이 테이프 (시안 유사색) |
| `--color-accent` | `#9CAFBF` | 작은 강조·선·장식 (시안 유사색) |
| `--color-text` | `#354858` | 영문 손글씨 타이틀과 본문 짙은 블루그레이 (시안 픽셀 색상) |
| `--color-text-muted` | `#7E8A92` | 보조 설명 (시안 유사색) |
| `--color-line` | `#DEE5E9` | 얇은 구분선·테두리 |
| `--color-focus` | `#354858` | 키보드 포커스 색상, 가시적인 외곽선과 병용 |

**사용 원칙:** 별도의 베이지·핑크·그린 팔레트를 추가하지 않고 현재 시안에서 사용한 스카이블루, 아이보리, 화이트, 블루그레이를 유지합니다. 종이 카드와 테이프는 같은 계열로 처리합니다. 웹 접근성을 위해 작은 본문 텍스트는 명도 대비를 확인합니다.

## 3. Typography

- **Korean body:** Pretendard, sans-serif
- **English UI / body:** Pretendard 또는 Arial, sans-serif
- **Display handwriting:** 실제 사용 폰트가 정해지면 별도로 등록하며, 핵심 정보나 긴 본문에는 사용하지 않습니다.

| Style | Desktop | Mobile | Weight | Line height |
|---|---|---|---|---|
| Display | `clamp(3rem, 6vw, 6.5rem)` | 유동형 | 500–600 | 1.05 |
| H1 | `clamp(2.5rem, 4vw, 4.5rem)` | 유동형 | 600 | 1.15 |
| H2 | `clamp(2rem, 3vw, 3rem)` | 유동형 | 600 | 1.2 |
| H3 | `1.5rem` | `1.25rem` | 600 | 1.3 |
| Body | `1rem` | `1rem` | 400 | 1.7 |
| Small | `0.875rem` | `0.875rem` | 400 | 1.5 |
| Label | `0.75rem` | `0.75rem` | 500 | 1.4 |

영문 프로젝트명은 대문자를 사용할 수 있지만, 긴 문장과 한국어 본문에 전체 대문자를 사용하지 않습니다.

## 4. Layout & Spacing

- **Content max-width:** `1440px`
- **Desktop horizontal padding:** `48px`
- **Tablet horizontal padding:** `32px`
- **Mobile horizontal padding:** `20px`
- **Spacing scale:** `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px`
- **Section vertical padding:** Desktop `96~128px`, Tablet `80px`, Mobile `64px`
- **Grid gap:** Desktop `24~32px`, Mobile `16px`

## 5. Components

| Element | Rule |
|---|---|
| Paper card | 흰색 종이, 얇은 선, 약한 그림자, 회전 각도 최대 약 ±4° |
| Image | 프로젝트 이미지 비율을 일관되게 유지, 찌그러짐 금지 |
| Tag | 작은 크기, 과도한 둥근 모서리·두꺼운 테두리 지양 |
| Button / Link | 명확한 텍스트와 hover·focus 상태 제공 |
| Tape / Doodle | 정보 위계를 방해하지 않는 장식으로만 사용 |

## 6. Motion

- **Libraries:** GSAP + ScrollTrigger (도입 시)
- **Micro interaction:** 약 `150~250ms`
- **Section reveal:** 약 `500~800ms`
- **Easing:** `power2.out`, `power3.out` 등의 자연스러운 감속
- **Card reveal:** 세 장이 중앙에 겹친 상태에서 좌·우로 펼쳐지는 연출
- **Important:** 스크롤 애니메이션 때문에 필수 콘텐츠가 읽히지 않아서는 안 됩니다.
- `prefers-reduced-motion: reduce`에서는 불필요한 이동·회전·패럴랙스를 비활성화합니다.

## 7. Responsive Breakpoints

| Target | Width |
|---|---|
| Mobile | `0–767px` |
| Tablet | `768–1279px` |
| Desktop | `1280px+` |

콘텐츠는 폭에 따라 재배치하며, 모바일에서 종이 카드가 지나치게 겹치거나 텍스트가 잘리지 않도록 합니다.

## 8. Accessibility

- 장문 텍스트는 최소 16px을 권장합니다.
- 의미가 있는 이미지에는 대체 텍스트를 지정합니다.
- 장식 이미지에는 빈 `alt`를 사용합니다.
- 키보드 탐색, 포커스 표시, 적절한 명도 대비를 확보합니다.
- 애니메이션 없이도 전체 콘텐츠를 이용할 수 있어야 합니다.

## 9. CSS Variables (Starter)

```css
:root {
  --color-bg: #faf8f3;
  --color-surface: #ffffff;
  --color-paper: #ffffff;
  --color-hero: #dce5eb;
  --color-tape: #b9cad5;
  --color-accent: #9cafbf;
  --color-text: #354858;
  --color-text-muted: #7e8a92;
  --color-line: #dee5e9;
  --color-focus: #354858;
  --font-body: 'Pretendard', Arial, sans-serif;
  --layout-max-width: 1440px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --radius-card: 4px;
  --shadow-paper: 0 6px 24px rgba(53, 72, 88, 0.08);
}
```

> 히어로·아이보리 배경 및 주 텍스트 색상은 제공된 시안에서 추출했습니다. 테이프·보조 텍스트·선은 육안 유사색이며, Figma에 실제 저장한 Fill 색상이 있다면 그 값을 우선합니다. 크기와 폰트는 구현용 기준안입니다.
