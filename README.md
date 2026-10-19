# 오윤서 포트폴리오

**ARCHIVING THE ART OF DESIGN**

브랜드의 특징과 사용자 경험을 분석하고 새로운 시각으로 재해석한 웹 디자인부터, 사회적 문제에 주목하고 이를 해결하기 위한 앱 UX/UI 디자인까지 다양한 프로젝트를 담았습니다. 기획과 리서치, 디자인, 인터랙션 및 웹 구현을 아우르는 작업 과정을 소개합니다.

## 구성

- **About / Design Approach** — 자기소개와 Observe · Explore · Create의 디자인 과정
- **Web Design** — 현대모터스튜디오 팀 프로젝트와 무브먼트랩·투슬래시포·로라로라 개인 프로젝트
- **App Design** — 위치 기반 역사 탐색 서비스 ‘오늘’과 환경 복원 활동 플랫폼 ‘EcoAction’
- **Video Design** — 로라로라 패션 영상과 Pudding World AI 영상
- **Software Skills** — 디자인·개발·AI·영상 도구 소개
- **Clone Coding** — 경동·롯데월드·뮤자인·트래블 웹사이트 구현
- **Contact** — 이메일, GitHub, 이력서 PDF

## 주요 기능

- 스크롤에 따른 가로 프로젝트 탐색과 드로잉·텍스트 등장 효과
- 기준 배치를 유지하며 이미지·텍스트·간격을 함께 조절하는 데스크톱 레이아웃
- 작은 화면을 위한 모바일 배치
- 영상 호버 재생과 클릭 시 소리 켜기·끄기
- 클론코딩 카드의 블러 효과와 `LINK` 커서, 사이트 이동
- 포트폴리오 정보를 안내하는 키워드 기반 챗봇
- 새 탭에서 열리는 이력서 PDF

## 기술

| 구분 | 사용 기술 |
| --- | --- |
| 화면 구성 | HTML, CSS, JavaScript ES Modules |
| 개발·빌드 | Vite |
| 엔딩 인터랙션 | React, GSAP, ScrollTrigger |
| 코드 검사 | Oxlint |
| 배포 설정 | Vercel |

주요 화면은 HTML 섹션과 JavaScript 모듈로 구성하며, 엔딩 영역은 React 번들로 별도 빌드합니다.

## 실행 방법

Node.js 20.19 이상 또는 22.12 이상의 지원 버전과 npm이 필요합니다.

```bash
npm ci
npm run dev
```

터미널에 표시되는 개발 서버 주소로 접속합니다. 개발 서버를 실행할 때 엔딩 번들이 먼저 생성됩니다.

```bash
# 엔딩 번들 생성 후 전체 사이트 빌드
npm run build

# 배포용 빌드 미리보기
npm run preview

# 코드 검사
npm run lint
```

Windows PowerShell에서 npm 실행 정책 오류가 발생하면 `npm` 대신 `npm.cmd`를 사용합니다.

## 폴더 구조

```text
index.html                  # 진입 HTML 및 섹션 포함 선언
public/
├── videos/                 # 프로젝트 영상
├── ending/                 # 빌드된 엔딩 모듈
└── resume-oh-yunseo.pdf     # 이력서
src/
├── main.js                 # 섹션 로딩 및 기능 초기화
├── sections.js             # HTML 섹션 로더
├── index.css               # 공통 스타일
├── drawingReveal.*         # 스크롤 드로잉 효과
├── viewportLayout.css      # 섹션 레이아웃
├── viewportStages.*        # 기준 배치 및 화면 크기 대응
└── components/             # 섹션별 HTML·CSS·JS와 이미지
vite.config.js              # 개발 서버 및 HTML 섹션 빌드
vite.ending.config.js       # React 엔딩 번들 빌드
vercel.json                # 배포 설정
```

`dist/`, `node_modules/`, `verification/`은 Git 관리에서 제외합니다. `verification/`은 로컬 검증 스크립트와 화면 캡처를 보관하는 임시 폴더입니다.

## 디자인과 반응형 기준

종이·테이프·손그림 그래픽과 아이보리·스카이블루 색상을 활용했습니다.

- 배경: `#FAF8F3`
- 스카이블루: `#DCE5EB`
- 주요 텍스트: `#354858`
- 폰트: Ownglyph PDH, Ownglyph Yuntaeng

개인·앱·영상 프로젝트 등 16개 화면은 **1920 × 900 CSS px** 배치를 기준으로 전체를 같은 비율로 조절합니다. 창의 너비와 높이에 맞춰 배율을 계산하며, 800px 이하에서는 모바일 배치를 사용합니다. 팀 프로젝트와 Approach는 별도의 캔버스 배율을 사용합니다.

상세 기준은 [반응형 레이아웃 문서](./RESPONSIVE_LAYOUT.md)와 [디자인 토큰 문서](./DESIGN_TOKENS.md)를 참고하세요.

## 클론코딩 사이트

| 프로젝트 | 사이트 |
| --- | --- |
| 경동 | [Kyungdong](https://kyungdong-iota.vercel.app/) |
| 롯데월드 | [Lotteworld](https://lotteworld.vercel.app/) |
| 뮤자인 | [Musign](https://musign-five.vercel.app/) |
| 트래블 | [Travel](https://travel-site-blue-nu.vercel.app/) |

## 링크

- [GitHub 저장소](https://github.com/yunseo-ux/yunseo_portfolio)
- [Figma 디자인](https://www.figma.com/design/zie8awdwtwHIBkdifsdOCu/)
- [이력서 PDF](./public/resume-oh-yunseo.pdf)
- 이메일: [ysoh0217@gmail.com](mailto:ysoh0217@gmail.com)

이 포트폴리오는 학습 및 개인 작업 소개를 목적으로 제작했습니다. 프로젝트에 사용된 브랜드명·이미지 등은 각 권리자에게 귀속됩니다.
