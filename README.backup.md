# 포트폴리오 사이트

HTML, JavaScript, CSS로 구성된 사이트입니다. React는 사용하지 않습니다.

## 실행

```powershell
npm.cmd install
npm.cmd run dev
```

## 파일 수정

- `index.html`: 전체 페이지 구성과 CSS 연결
- `src/main.js`: JavaScript 시작 파일
- `src/index.css`: 공통 스타일과 연필 커서
- `src/components/`: 섹션별 HTML, CSS, 동작용 JavaScript
- `src/components/Hero/HeroDoodle.js`: 그림 그리기와 지우기
- `src/components/TeamProject/TeamProject.js`: 가로 스크롤과 노트북 자동 스크롤

HTML 파일은 `<!-- @include /src/components/.../파일.html -->`로 연결합니다. Vite가 개발 서버와 빌드에서 실제 HTML로 합쳐 줍니다. 섹션 파일을 수정하면 페이지에 반영됩니다. 디자인·폰트·이미지·기존 CSS 값은 React 버전에서 그대로 유지했습니다.

## 검증 및 빌드

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

`dist/`에는 합쳐진 HTML과 정적 CSS·JavaScript·이미지가 생성됩니다.

## 원본 백업

`backups/react-before-html-conversion.zip`에 변환 전 소스와 설정을 보관했습니다. 기존 JSX로 복원할 때 사용할 수 있습니다.
