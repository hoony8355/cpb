# NAVER SEO Baseline Checklist

이 문서는 네이버 서치어드바이저 웹마스터 가이드의 **기초 항목**을 운영 체크리스트로 정리한 문서입니다.

## 1) 소유 확인
- [ ] 네이버 서치어드바이저에 `https://cpb-five.vercel.app` 호스트 등록
- [ ] 소유 확인(meta 또는 파일 업로드) 완료

## 2) robots.txt
- [x] 루트 경로 `/robots.txt` 제공
- [x] `User-agent: Yeti` 접근 허용
- [x] `User-agent: *` 접근 허용
- [x] `Sitemap` / `RSS` 절대 URL 기입

## 3) 사이트맵 / RSS
- [x] `/sitemap.xml` 생성 및 배포
- [x] `/rss.xml` 생성 및 배포
- [x] RSS item에 본문 텍스트 포함(요약만 제공하지 않음)
- [ ] 서치어드바이저에 사이트맵 제출
- [ ] 서치어드바이저에 RSS 제출

## 4) 단일 호스트 / canonical
- [x] 페이지 canonical URL 사용
- [ ] 커스텀 도메인 사용 시 단일 대표 호스트로 301 정리

## 5) 문서 수집/노출 점검
- [ ] `site:cpb-five.vercel.app` 질의로 반영 문서 수 점검
- [ ] 주요 페이지 noindex / nofollow 오설정 여부 점검
- [ ] 웹마스터도구 리포트(노출/클릭/수집오류) 주기 점검

## 6) 심화 구조화 데이터
- [x] 루트 페이지 `Organization.sameAs` 지원 (`VITE_SOCIAL_CHANNELS` 사용)
- [x] 포스트 페이지 `BreadcrumbList`를 페이지 계층형 키워드로 확장
- [x] FAQ 답변은 허용 태그(`<a>`, `<ol>`, `<ul>`, `<li>`) 중심으로 정리
- [x] 루트 페이지 최신 글 `ItemList`(캐러셀 대응) 구조화 데이터 추가

## 7) IndexNow (선택)
- [x] 단건/다건 전송용 스크립트 추가: `npm run indexnow -- <url...>`
- [x] 사이트맵 기반 일괄 전송 스크립트: `npm run indexnow:sitemap`
- [x] key 파일 생성 스크립트: `npm run indexnow:keyfile`
- [ ] 환경변수 설정
  - `INDEXNOW_KEY`
  - `INDEXNOW_KEY_LOCATION` (선택)
- [ ] GitHub Actions secret 설정 후 `.github/workflows/indexnow.yml` 활성화

### Vercel에서 IndexNow 운영 순서
1. `INDEXNOW_KEY`를 Vercel 환경변수로 설정
2. `npm run indexnow:keyfile` 실행하여 `public/<key>.txt` 생성 후 배포
3. `INDEXNOW_KEY_LOCATION=https://<대표도메인>/<key>.txt` 설정
4. GitHub Secrets에 `INDEXNOW_KEY`, `INDEXNOW_KEY_LOCATION` 등록
5. main 배포 후 워크플로우가 `SITEMAP_URL` 기준 URL들을 IndexNow에 일괄 전송

### GitHub Pages 브랜치 운영 시
- IndexNow 워크플로우는 모든 브랜치 push를 감지하고(`gh-pages` 제외) 동작하도록 설정되어 있어, 브랜치명이 바뀌어도 매번 워크플로우 파일을 수정할 필요가 없습니다.
- `SITE_URL`은 `https://hoony8355.github.io/cpb` 로 설정하세요.
- 프로젝트 페이지(`/cpb`) 구조에서는 `INDEXNOW_KEY_LOCATION`을 `https://hoony8355.github.io/cpb/<key>.txt`로 설정하면 해당 경로 하위 URL 전송에 사용할 수 있습니다.

### INDEXNOW_KEY 추천 규칙
- 허용 문자: `a-f`, `A-F`, `0-9`, `-`
- 길이: 8~128자
- 추천 예시: `b9f3a8e2-6d4c-4f0a-a9c1-7e3b2d4f8a1c`
