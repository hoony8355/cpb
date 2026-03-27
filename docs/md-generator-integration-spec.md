# MD 문서 생성기 연동 스펙 (NAVER SEO 고도화용)

이 문서는 **별도 GitHub Action으로 동작하는 MD 문서 생성기**를 우리 블로그 코드 구조에 맞춰 정렬하기 위한 연동 규격입니다.  
목표는 생성된 아티클이 현재 코드(`HomePage`, `PostPage`, prerender scripts)가 기대하는 데이터/구조를 충족하게 하는 것입니다.

---

## 1. 연동 목표

1. 생성기 출력(md/frontmatter)이 현재 렌더/프리렌더 파이프라인과 충돌 없이 동작해야 한다.
2. NAVER 가이드의 핵심 구조화 데이터(연관채널/Breadcrumb/FAQ/ItemList/AggregateRating/Review)를 실제 콘텐츠로 반영 가능해야 한다.
3. 브랜치/배포 구조가 바뀌어도 문서 생성기가 깨지지 않도록 변수 기반으로 운영한다.

---

## 2. 생성기 출력 파일 계약 (File Contract)

생성기는 `posts/<slug>.md` 형식으로 파일을 생성한다.

- 파일명 slug 규칙: 소문자, 숫자, 하이픈(`-`) 중심.
- 글 1개 = 파일 1개.
- 본문은 Markdown + 제한적 HTML 허용.

---

## 3. Frontmatter 계약 (필수/권장)

아래 필드는 현재 코드가 사용하거나 향후 스키마 고도화 시 필요한 최소 계약이다.

### 필수

```yaml
title: "문서 제목"
description: "문서 요약(메타 설명)"
date: "2026-03-27T00:00:00.000Z"
author:
  name: "Trend Spotter 콘텐츠 팀"
keywords:
  - "키워드1"
  - "키워드2"
```

### 권장

```yaml
coverImage: "https://.../cover.jpg"
faq:
  - question: "질문 1"
    answer: "답변 1 (a/ol/ul/li 외 태그 최소화)"
products:
  - name: "상품명"
    description: "핵심 포인트"
    link: "https://..."
    imageUrl: "https://.../image.jpg"
    rating: 4.6
    reviewCount: 132
    ratingCount: 132
    reviews:
      - reviewBody: "실사용 후기 1"
        ratingValue: 5
      - reviewBody: "실사용 후기 2"
        ratingValue: 4
```

> 참고: `reviews`/`ratingCount`는 현재 런타임 코드에 직접 반영되어 있지 않더라도, 생성기 출력 계약에 미리 포함하면 추후 `Review` 스키마 확장 시 재수집 없이 활용 가능.

### 3.1 기존 생성 양식 호환 규칙 (중요)

기존 생성기 출력 포맷(사용자 제공 샘플)을 그대로 사용할 수 있도록 아래 키를 표준으로 고정한다.

```yaml
schema_data:
  products:
    - name: string
      url: string # 절대 URL
      image: string # 절대 URL
      brand: string
      offer:
        priceCurrency: "KRW"
        price: number
        availability: "https://schema.org/InStock"
      review:
        author: string
        reviewBody: string
      pros: [string]
      cons: [string]
      short_reason: string
      caution: string
      # 확장(선택)
      ratingValue: number
      reviewCount: number
      ratingCount: number
      reviews:
        - reviewBody: string
          ratingValue: number
  faq:
    - question: string
      answer: string
  breadcrumbs:
    - name: string
      url: string # 절대 URL
  about:
    keyword: string
```

`schema_data.products[*].image`는 현재 렌더 코드의 `product.imageUrl`과 연결되므로, 변환 시 `image -> imageUrl` 매핑 로직을 생성기 또는 후처리 단계에 두는 것을 권장한다.

---

## 4. 본문 구조 규칙 (Markdown Contract)

생성기는 아래 본문 패턴을 지켜야 한다.

1. `##`, `###` 헤더를 충분히 사용 (TOC/section summary 계산에 필요)
2. FAQ는 frontmatter `faq`를 우선 사용
3. 표(table) 사용 시 Markdown 표 문법 사용 (prerender에서 wrap 처리)
4. 외부 링크는 절대 URL 사용
5. 리뷰/평점 문구는 숫자/특수문자만으로 구성된 텍스트 금지

### 4.1 본문 섹션 순서 템플릿 (기존 양식 호환)

아래 순서를 기본 골격으로 강제하면 품질 편차가 크게 줄어든다.

1. 쿠팡 파트너스 고지 문구
2. `## 빠른 결론 3줄`
3. `## 어떤 기준으로 골랐는지`
4. `## 가격대별 추천 요약표`
5. `## 이런 사람에게 맞는 글 / 아닌 글`
6. `## <키워드> 추천 상품 목록`
   - `### 1. 상품명`
   - 이미지
   - 핵심 요약 문단
   - 브랜드 / 평점·리뷰
   - 추천 근거
   - 추천 대상
   - 주의할 점
   - 대체 선택지
   - CTA 링크
7. `## 선택 팁 정리`
8. `## 자주 묻는 질문 (FAQ)`
9. `## 함께 보면 좋은 글`

---

## 4.2 금지/주의 규칙 (생성기 프롬프트에 반드시 포함)

- frontmatter와 본문 사이 `---` 구분선 누락 금지
- 동일 문단/문장 반복 금지 (특히 상품 설명 블록)
- `breadcrumbs`의 `name`에 “홈/top” 단독 사용 금지  
  (예: “Trend Spotter 블로그 메인”, “제품 추천 아티클”처럼 의미 있는 계층명 사용)
- FAQ 답변은 `<a> <ol> <ul> <li>` 외 HTML 태그 남용 금지
- `url`, `image`는 상대경로 금지, 단축 URL 금지

---

## 4.3 생성기 출력 예시 (축약)

```md
---
title: "2026 양념갈비 추천 TOP 2 (가격·리뷰 기준)"
date: "2026-03-26"
description: "..."
keywords: ["양념갈비", "양념갈비 추천", "양념갈비 비교"]
schema_data:
  products:
    - name: "상품 A"
      url: "https://..."
      image: "https://..."
      brand: "브랜드A"
      offer:
        priceCurrency: "KRW"
        price: 59800
        availability: "https://schema.org/InStock"
      review:
        author: "구매자 리뷰 요약"
        reviewBody: "..."
      pros: ["장점 1"]
      cons: ["단점 1"]
      short_reason: "핵심 추천 이유"
      caution: "구매 전 주의점"
  faq:
    - question: "초보자는 무엇부터 봐야 하나요?"
      answer: "..."
  breadcrumbs:
    - name: "Trend Spotter 블로그 메인"
      url: "https://cpb-five.vercel.app"
    - name: "2026 양념갈비 추천 TOP 2 (가격·리뷰 기준)"
      url: "https://cpb-five.vercel.app/post/yangnyeomgalbi"
  about:
    keyword: "양념갈비"
---

## 빠른 결론 3줄
...
```

---

## 5. NAVER 가이드 매핑 (생성기 관점)

### 5.1 사이트 연관채널 (Organization.sameAs)
- 생성기가 직접 주입하지 않고, 런타임 env(`VITE_SOCIAL_CHANNELS`)와 결합됨.
- 생성기 문서에는 채널 URL 후보를 별도 섹션으로 작성 가능.

### 5.2 BreadcrumbList
- “홈/top” 같은 일반어 지양.
- 상위 > 중간 > 현재 문서 구조로 제목 생성.
- 생성기에서 문서 카테고리 키워드를 함께 출력하면 런타임 확장 시 유리.

### 5.3 FAQPage
- question/answer 1:1.
- answer는 `<a> <ol> <ul> <li>` 중심(기타 태그 남용 금지).

### 5.4 캐러셀(ItemList)
- 생성기 단에서 “관련 글 후보”를 5~10개 메타로 출력 가능.
- 각 항목은 name/image/url을 중복 없이 제공.

### 5.5 AggregateRating / Review
- ratingValue는 0 이상 실수/정수.
- reviewCount 또는 ratingCount 최소 1개 제공.
- reviewBody는 의미 있는 자연어 문장으로 제공.

---

## 6. 브랜치/배포 변수 계약 (Branch-safe)

생성기 및 연동 문서에는 하드코딩 대신 아래 변수를 사용:

```yaml
DOC_BRANCH: "<문서 생성 워크플로우 브랜치>"
CONTENT_BRANCH: "<posts 반영 브랜치>"
DEPLOY_BRANCH: "<실배포 브랜치>"
SITE_URL: "https://cpb-five.vercel.app"
SITEMAP_URL: "https://cpb-five.vercel.app/sitemap.xml"
```

브랜치명이 변경되어도 **변수 값만 수정**하면 되게 설계한다.

---

## 7. 생성기 출력 품질 게이트 (필수 검증)

아래 조건을 모두 통과해야 생성 완료로 본다.

1. 필수 frontmatter 누락 없음
2. `title`, `description` 길이 기준 충족
3. `faq` 항목은 question/answer 둘 다 존재
4. `products` 항목 링크는 절대 URL
5. 본문 헤더(`##`/`###`) 최소 3개 이상
6. 금지 패턴(빈 답변, 깨진 URL, 중복 이미지) 없음

---

## 8. Codex(생성기 저장소)로 전달할 핵심 요구사항 요약

1. **출력 계약 준수**: frontmatter 키/타입 엄수
2. **NAVER 스키마 친화 구조**: FAQ/Breadcrumb/ItemList/AggregateRating/Review 생성 가능 데이터 포함
3. **브랜치 변수화**: 브랜치명 하드코딩 금지
4. **운영 분리**: 생성기 저장소는 md 생성만, 렌더/배포 저장소는 스키마 주입/배포 담당
5. **검증 자동화**: 생성 완료 전 품질 게이트 통과 필수

---

## 9. 빠른 전달용 메시지 (복붙)

> 우리 MD 생성기는 `posts/*.md`를 출력할 때 frontmatter 계약과 NAVER SEO 스키마 매핑을 충족해야 합니다.  
> 특히 FAQ(question/answer), Breadcrumb용 카테고리 계층, ItemList용 항목(name/image/url), Product 평점/리뷰 데이터를 포함해 주세요.  
> 브랜치/도메인은 하드코딩하지 말고 `DOC_BRANCH`, `CONTENT_BRANCH`, `DEPLOY_BRANCH`, `SITE_URL`, `SITEMAP_URL` 변수를 사용해 주세요.
