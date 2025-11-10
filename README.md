# Astro Starter - Jinseoit

Astro 기반으로 제작된 개인 기술 블로그 스타터 템플릿으로, 깔끔한 디자인과 빠른 성능을 갖춘 정적 웹사이트입니다.

![Astro Starter Jinseoit](/public/preview.png)

## ✨ 주요 기능

- 🎨 **다크/라이트 테마 지원** - 사용자 선호도에 따른 자동 테마 전환
- 📱 **완전 반응형 디자인** - 모든 디바이스에서 최적화된 경험
- ⚡ **빠른 로딩 속도** - 100/100 Lighthouse 성능 점수
- 🔍 **SEO 최적화** - 메타 태그, OpenGraph, 구조화된 데이터 지원
- 📝 **마크다운 지원** - 코드 하이라이팅과 복사 기능 포함
- 🏷️ **태그 시스템** - 포스트 분류 및 필터링 (무한 스크롤)
- 📡 **RSS 피드** - 구독자들을 위한 자동 피드 생성
- 🗺️ **사이트맵** - 검색 엔진 최적화
- 🎯 **접근성 고려** - 키보드 네비게이션 및 스크린 리더 지원
- 🖼️ **이미지 최적화** - 스켈레톤 로딩 및 지연 로딩
- 🔄 **무한 스크롤** - 성능 최적화된 포스트 로딩
- 🏗️ **SOLID 원칙** - 체계적인 코드 구조 및 타입 안전성

## 🚀 기술 스택

- **프레임워크**: [Astro](https://astro.build/) - 빠른 정적 사이트 생성
- **스타일링**: [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 퍼스트 CSS
- **언어**: [TypeScript](https://www.typescriptlang.org/) - 타입 안전성
- **폰트**: [Pretendard](https://cactus.tistory.com/232) - 한글 최적화 폰트
- **패키지 매니저**: [pnpm](https://pnpm.io/) - 빠른 패키지 설치

## 📁 프로젝트 구조

```
astro-starter-jinseoit/
├── public/
│   ├── fonts/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── icons/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PostCard.astro
│   │   ├── tagList.astro
│   │   ├── ThemeToggle.astro
│   │   └── LoadingIndicator.astro
│   ├── constants/
│   │   ├── index.ts
│   │   ├── site.ts
│   │   ├── ui.ts
│   │   ├── routes.ts
│   │   └── events.ts
│   ├── content/
│   │   └── posts/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── MainLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── posts/
│   │   ├── tags/
│   │   └── rss.xml.js
│   ├── styles/
│   │   ├── global.css
│   │   └── markdown.css
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── tagListLogic.ts
├── scripts/
│   └── new-post.js
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 개발 서버 실행

```bash
# 개발 서버 시작 (localhost:4321)
pnpm dev
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview
```

## 📝 포스트 작성

### 새 포스트 생성 스크립트 사용

```bash
# 새 포스트 생성 (자동으로 conents/posts 마크다운 파일 생성)
pnpm new-post
```

### 수동으로 포스트 작성

`src/content/posts/` 디렉토리에 마크다운 파일을 생성하세요:

```markdown
---
title: "포스트 제목"
description: "포스트 설명"
pubDate: 2024-01-01
tags: ["태그1", "태그2"]
---

포스트 내용...
```

### 지원하는 frontmatter 필드

- `title`: 포스트 제목 (필수)
- `description`: 포스트 설명 (선택)
- `pubDate`: 발행일 (필수)
- `tags`: 태그 배열 (선택)
- `image`: 대표 이미지 경로 (선택)
- `author`: 작성자 (선택, 기본값: DEFAULT_AUTHOR)

## 🎨 커스터마이징

### 사이트 정보 변경

`src/constants/site.ts`에서 사이트 기본 정보를 수정하세요:

```typescript
export const SITE_TITLE = "Jinseoit Blog";
export const SITE_DESCRIPTION = "개인 기술 블로그";
export const DEFAULT_AUTHOR = "jinseoit";
```

### 색상 테마 변경

`src/styles/global.css`에서 CSS 변수를 수정하여 색상을 변경할 수 있습니다:

```css
:root {
  --primary-color: #66cdaa; /* 메인 색상 */
  --text-color: oklch(30% 0 0); /* 텍스트 색상 */
  --card-color: oklch(100% 0 0); /* 카드 배경색 */
}
```

### UI 상수 변경

`src/constants/ui.ts`에서 UI 관련 상수들을 수정할 수 있습니다:

```typescript
export const UI_CONSTANTS = {
  IMAGE_LOAD_DELAY: 200,
  INTERSECTION_ROOT_MARGIN: "100px",
  INTERSECTION_THRESHOLD: 0.1,
  POSTS_PER_LOAD: 5, // 무한 스크롤 시 한 번에 로드할 포스트 수
};
```
### 현재 SEO 설정

이 프로젝트는 **테스트용 배포를 위해 SEO 크롤링이 차단된 상태**입니다.

#### 🔒 크롤링 차단 설정

- **robots.txt**: `public/robots.txt`에서 모든 검색 엔진 크롤링 차단
- **noindex 메타 태그**: `<meta name="robots" content="noindex, nofollow">`로 검색 엔진 인덱싱 차단
- **사이트맵**: 자동 생성되지만 크롤링은 차단됨

#### 📋 SEO 크롤링 활성화 방법

프로덕션 배포 시 SEO 크롤링을 활성화하려면:

1. **robots.txt 수정**:

   ```txt
   User-agent: *
   Allow: /

   Sitemap: https://your-domain.com/sitemap-index.xml
   ```

2. **noindex 메타 태그 제거**:
   `src/components/BaseHead.astro`에서 다음 라인 제거:

   ```html
   <meta name="robots" content="noindex, nofollow" />
   ```

3. **사이트 URL 설정**:
   `astro.config.mjs`에서 실제 도메인으로 변경:
   ```javascript
   export default defineConfig({
     site: "https://your-domain.com",
     // ...
   });
   ```

#### 🎯 SEO 최적화 기능

프로젝트에 포함된 SEO 최적화 기능들:

- **메타 태그**: 완전한 Open Graph, Twitter Card 지원
- **사이트맵**: 자동 생성 (`/sitemap-index.xml`)
- **RSS 피드**: 자동 생성 (`/rss.xml`)
- **구조화된 데이터**: 마크다운 헤딩 자동 링크
- **이미지 최적화**: 적응형 이미지 및 WebP 지원
- **폰트 최적화**: woff2 포맷 및 preload 설정

#### 🔧 SEO 설정 파일 위치

- **메타 태그**: `src/components/BaseHead.astro`
- **사이트 정보**: `src/constants/site.ts`
- **robots.txt**: `public/robots.txt`
- **사이트맵 설정**: `astro.config.mjs`
