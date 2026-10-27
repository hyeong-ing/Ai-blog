---
name: blog-writer
description: 검증된 AI 조사 자료를 한국어 블로그 본문과 별도 SEO 메타데이터 초안으로 작성할 때 사용한다.
---

# blog-writer

모든 경로는 프로젝트 루트 기준이다. 공통 정책은 아래 참조 파일을 원본으로 사용한다. `guidelines/source-policy.md`의 조사 폴더 전달 규칙을 읽고 `research_dir`와 `topic_slug`를 유지한다. 아래 날짜 경로는 기본값이며 추가 주제는 전달받은 slug 하위 조사 폴더에 저장한다.

## 실행과 입력

fact-check가 작성 가능으로 판정한 뒤 실행한다. `guidelines/editorial-guide.md`, `guidelines/search-visibility-policy.md`, `templates/blog-post.md`, 해당 날짜 네 조사 파일, 게시 이력을 읽는다.

## 작업 순서

1. 검증된 핵심 변화와 독자가 할 수 있는 일을 정한다. topic slug를 유지한다.
2. 템플릿을 주제에 맞게 축약해 자연스러운 한국어 본문을 작성한다. 검증 ID·편집 메모는 본문에 노출하지 않는다.
3. 채택된 사실에 직접 링크, 해석·활용 아이디어에 명확한 범위, 조건부 주장에 조건을 붙인다. 체험을 만들지 않는다.
4. community.md가 생략 판정이면 사용자 반응 절 전체를 삭제한다. 사용법·FAQ·표는 필요한 경우에만 둔다.
5. 검색 정책의 메타데이터 계약에 따라 별도 SEO 파일을 만들고 실제 `Research Directory:` 경로와 검토 전 상태를 표시한다. 시험 실행·잠정 선정·미완료 상태도 SEO 파일과 최종 보고에 유지한다. 가짜 게시 URL·이미지·저자를 추가하지 않는다.

## 결과와 실패

`posts/drafts/YYYY-MM-DD-topic.md`, `posts/drafts/YYYY-MM-DD-topic-seo.md`를 저장하고 `topics/candidates.md`를 초안으로 갱신한다. 기존 초안은 읽고 수정 사유를 조사 파일에 기록한다.
핵심 근거 부족·작성 보류를 무시하고 본문을 생성하지 않는다. 새 사실을 추가해야 하면 fact-check로 돌린다.

## 다음 단계

search-visibility-review에 본문·SEO 경로와 조사 폴더를 전달한다. 모든 산출물은 사용자 검토를 기다리는 Draft다.
