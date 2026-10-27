---
name: topic-research
description: 일일 AI 주제 탐색·선정과 공식 자료 조사를 수행할 때 사용한다. 기존 게시·초안 중복을 확인하고 날짜별 근거 파일을 만든다.
---

# topic-research

모든 경로는 프로젝트 루트 기준이다. 공통 정책은 아래 참조 파일을 원본으로 사용한다. `guidelines/source-policy.md`의 조사 폴더 전달 규칙을 읽고 `research_dir`와 `topic_slug`를 유지한다. 아래 날짜 경로는 기본값이며 추가 주제는 전달받은 slug 하위 조사 폴더에 저장한다.

## 실행과 입력

매일 탐색하거나 후보를 다시 고를 때 실행한다. 프로젝트 루트 기준 `AGENTS.md`, `guidelines/topic-policy.md`, `guidelines/source-policy.md`, `topics/published.md`, `topics/candidates.md`, 기존 초안을 읽는다.

## 작업 순서

1. 실행 KST 날짜·시각과 조사 범위를 정하고 기존 날짜 폴더를 읽는다. 사용할 `research_dir`를 확정하고 후속 단계에 전달한다. 덮어쓰지 않는 규칙은 topic-policy를 따른다.
2. 실제 웹 검색으로 다섯 범주와 여러 기업의 후보를 탐색하고 검색어·접근 결과를 남긴다. 먼저 24~48시간, 필요하면 7일로 확장한다.
3. 후보별 변화·개발자 효용·공식 근거·중복을 비교해 하나를 선정하거나 선정 없음으로 끝낸다. 상위 범주의 미검증 후보를 후보 없음으로 취급하지 말고 잠정 선정·보류를 구분한다.
4. 선정 주제의 공식 원문을 읽고 주장 ID·날짜·버전·제공 조건·미확인 항목을 정리한다. 기억이나 검색 요약만으로 사실을 채우지 않는다.

## 결과와 실패

`research/YYYY-MM-DD/topic-candidates.md`, `official-research.md`를 source-policy의 계약에 맞춰 저장한다. `topics/candidates.md`에 후보 상태와 조사 경로를 반영한다.
검색 불가·핵심 공식 근거 접근 불가·중복만 존재하면 해당 사유와 미완료/보류를 기록하고 선정된 것처럼 넘기지 않는다. 가치 있는 후보가 없으면 정상적인 선정 없음이다.

## 다음 단계

community-research에 두 조사 파일과 선정 slug, 공식 자료 URL·대상 버전·미확인 질문을 전달한다. 후보 없는 날에는 후속 Skill을 실행하지 않는다.
