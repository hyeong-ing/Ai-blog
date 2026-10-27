---
name: search-visibility-review
description: AI 블로그 초안의 SEO·AEO·GEO 가독성, 메타데이터와 검색 정책 준수 여부를 검토할 때 사용한다.
---

# search-visibility-review

모든 경로는 프로젝트 루트 기준이다. 공통 정책은 아래 참조 파일을 원본으로 사용한다. `guidelines/source-policy.md`의 조사 폴더 전달 규칙을 읽고 `research_dir`와 `topic_slug`를 유지한다. 아래 날짜 경로는 기본값이며 추가 주제는 전달받은 slug 하위 조사 폴더에 저장한다.

## 실행과 입력

본문과 SEO 파일 생성·수정 후 실행한다. `guidelines/search-visibility-policy.md`, `guidelines/editorial-guide.md`, `templates/review-checklist.md`, 대상 본문·SEO·fact-check·게시 이력을 읽는다.

## 작업 순서

1. 검색 정책의 공식 URL에 웹 접근해 현재 권장과 접근 상태를 확인한다. 정책 변경이 있으면 출처·확인일과 함께 문서도 갱신한다. 검색 불가면 정책 최신성은 미검증으로 표시한다.
2. 제목·도입·소제목·용어·차이·활용·제한·근거·중복 표현을 검토한다. 강제 FAQ·과장·키워드 반복·AI 인용 보장은 제거한다.
3. 메타데이터 필드를 확인한다. 게시 URL이 없는 내부 링크, 존재하지 않는 이미지 alt, 가짜 구조화 데이터는 넣지 않는다. 플랫폼 미정의 기술 SEO는 적용 대기로 남긴다.
4. 편집 수정은 직접 반영하되 새로운 사실은 fact-check로 돌린다. 수정 후 본문과 SEO가 일치하는지 재검토한다.

## 결과와 실패

기존 `posts/drafts/YYYY-MM-DD-topic-seo.md`에 검토 시각·공식 URL·항목별 통과/수정 필요/미검증/해당 없음·반영 내용·남은 작업을 기록한다. 완료 상태는 사용자 검토 대기이며 게시 완료가 아니다.
중요한 허위 주장이나 해결되지 않은 근거 문제가 있으면 사용자 검토용 완성 초안으로 통과시키지 않는다. 플랫폼 설정·색인·검색 성과를 실행하거나 검증하지 않았으면 미적용/미검증으로 적는다.

## 다음 단계

사용자에게 본문·SEO 파일 링크와 남은 검토 항목을 전달한다. `templates/review-checklist.md`를 안내한다. 로그인·업로드·게시·게시 API·스케줄 활성화는 수행하지 않는다.
