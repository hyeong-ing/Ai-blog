---
name: community-research
description: 선정한 AI 주제에 대한 실제 커뮤니티 경험을 조사하고 인용 가능 여부를 판단할 때 사용한다.
---

# community-research

모든 경로는 프로젝트 루트 기준이다. 공통 정책은 아래 참조 파일을 원본으로 사용한다. `guidelines/source-policy.md`의 조사 폴더 전달 규칙을 읽고 `research_dir`와 `topic_slug`를 유지한다. 아래 날짜 경로는 기본값이며 추가 주제는 전달받은 slug 하위 조사 폴더에 저장한다.

## 실행과 입력

공식 조사 뒤 실행한다. `guidelines/source-policy.md`, 해당 날짜의 `topic-candidates.md`, `official-research.md`를 읽는다. 선정 주제가 없으면 종료한다.

## 작업 순서

1. 제품·기능·버전을 검색어에 포함해 Reddit/HN/GitHub/Hugging Face 등 주제와 관련된 커뮤니티를 웹 검색한다.
2. 원문과 댓글 맥락을 직접 확인한다. Positive/Negative/Neutral을 탐색하되 빈 분류를 만들지 않는다.
3. 의견별 URL·발언자·작성 시각·확인 시각·환경·경험/추측·독립성을 source-policy 계약으로 기록한다.
4. 제품 기능의 사실 주장은 공식 근거가 필요한 질문으로 분리하고, 본문 리뷰 채택/생략을 결정한다.

## 결과와 실패

`research/YYYY-MM-DD/community.md`를 저장한다. 적절한 경험이 없으면 조사 범위와 `본문 리뷰 생략`을 남긴다. 이는 후속 진행을 막지 않는다. 원문 접근 불가면 미검증으로 남기고 인용하지 않는다. 검색 자체를 실행하지 못한 경우 미완료이며 조사 완료를 주장하지 않는다.

## 다음 단계

fact-check에 community.md, 채택 가능한 의견 ID와 추가 사실 검증 질문을 넘긴다. 초안에 채택을 강제하지 않는다.
