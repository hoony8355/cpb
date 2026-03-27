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

