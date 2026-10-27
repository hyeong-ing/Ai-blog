# 매일 실행 프롬프트

아래 내용을 프로젝트 루트에서 Codex에 입력한다. 날짜는 실행 시 Asia/Seoul로 결정한다.

```text
AGENTS.md와 guidelines의 정책을 읽고 오늘의 AI 블로그 초안을 준비해줘.
먼저 topics/published.md, topics/candidates.md와 기존 초안을 확인해 중복을 피하고 기존 자료를 보존해줘.
topic-research → community-research → fact-check → blog-writer → search-visibility-review 순으로 실행해줘.
각 단계의 .agents/skills/<name>/SKILL.md를 읽고, 파일이 없으면 skill-staging/<name>/SKILL.md를 읽어줘.
지난 24~48시간을 실제 웹 검색하고 필요하면 7일로 넓혀줘. 다섯 주제 범주를 검토하되 가치가 없으면 선정 없음으로 끝내고 뉴스를 과장하지 마.
큰 발표와 실용적인 Skill/Tool/Workflow를 함께 수집하고 guidelines/topic-policy.md 실용성 개편 v2를 적용해줘. 점수 전에 후보마다 대상 개발자·새로 할 업무·현실적 접근성(플랜/비용/환경/권한)·공식 사용 방법·지금 알아둘 이유를 답하고 적합성을 판정해줘. A 실전 활용형과 B AI 변화 관찰형으로 분류하고, 활용성 30/접근·적용 난이도 20(쉬울수록 고점)/일반 개발자 관련성 20/기존 차이 15/공식 근거 10/최신성 5로 근거와 추정을 기록해줘. 적합한 A를 우선하고 B는 지금 관찰할 영향이 매우 큰 이유와 A보다 먼저 다룰 이유가 있을 때만 예외로 선정해줘. 범주별 고정 순서·비율은 없어. 핵심 조건 불명확·부적합 후보는 높은 점수로 통과시키지 말고 추가 조사 또는 보류해줘. 리뷰 부족만으로 유용한 검증 기능을 탈락시키지 마. 최종 선정 전에 독자가 얻을 것·실제 적용 방법·공식 근거·지금 필요한 이유의 네 답을 남기고, B는 당장 적용 불가와 관찰 가치의 범위를 명시해줘. 과거 점수와 연구는 보존하고 재평가는 별도 파일로 저장해줘.
research_dir를 확정해 단계마다 전달해줘. 기본은 research/YYYY-MM-DD/이며, 같은 날 다른 주제를 추가하면 research/YYYY-MM-DD/<topic-slug>/를 사용해줘.
해당 폴더의 네 조사 파일과 posts/drafts/YYYY-MM-DD-topic.md 및 -seo.md를 만들고 SEO 파일에 Research Directory: 실제 조사 경로를 기록해줘.
주요 주장 미검증이면 다음 단계로 통과시키지 말고 미완료 사유를 기록해줘. 리뷰가 부족하면 본문 사용자 반응 절을 생략해줘.
직접 사용한 경험을 만들지 말고 Fact, Community Opinion, Interpretation을 구분해줘.
search-visibility-review의 본문 수정까지 끝난 뒤 최종 본문 파일을 입력으로 `node scripts/render-preview.mjs posts/drafts/YYYY-MM-DD-topic.md`를 실행해줘. 실제 고유 파일명으로 대체하며 본문·SEO 원본은 변경하지 마. 이 명령은 posts/previews/에 스타일을 포함한 오프라인 HTML을 만들고 충돌 시 -v2 등 새 이름을 출력한다. Node가 PATH에 없다면 load_workspace_dependencies 도구의 Node 실행 경로를 사용해줘. HTML을 AI가 별도로 재작성하지 말고 원문 HTML·스크립트·위험한 링크를 실행 가능하게 삽입하지 마. 변환 실패는 본문 작성 실패와 구분해 보고하고 HTML 생성 성공을 주장하지 마. 이후 본문을 수정하면 미리보기도 다시 생성해줘.
본문·SEO 최종 검토 후 guidelines/image-policy.md를 읽고 본문과 fact-check에 근거해 2~4개 이미지 후보/위치를 검토해줘. 필요 없으면 생략하고 외부 후보의 원본 URL·제공자·이용 조건·사용 확인 상태·삽입 위치·이유·캡션·alt를 research_dir/image-plan.json에 기록해줘. 검증 사실만으로 설명용 개념도를 만들 수 있으면 실제 UI와 구분해 생성하고 `node scripts/prepare-images.mjs 실제-image-plan.json-경로`로 posts/assets/ 및 posts/drafts/YYYY-MM-DD-topic-image-guide.md를 준비해줘. 외부 이미지 권한이 불확실하면 다운로드·재배포하지 마. 도구·웹·다운로드·캡처·렌더링·저장 실패는 이미지 상태에 기록하고 본문·SEO·일반 HTML 생성은 계속해줘. 본문·SEO·기존 HTML에 무단 삽입하지 마. Google·네이버 공식 이미지 안내의 최신 접근 결과를 확인하고 개수·노출·AI 인용을 보장하지 마.
앞으로 새로 작성하는 초안과 채팅으로 전달하는 예시 본문에는 채택한 이미지 위치마다 `(설명용 개념도 이미지 첨부)` 형식의 독립된 줄을 넣어줘. 형식은 `({이미지 이름} 이미지 첨부)`이고 실제 이미지 이름을 사용하며 중첩 괄호를 쓰지 말고, 사용자가 이 문구를 지우고 직접 이미지를 첨부하게 해줘. 불필요하거나 권한 미확인으로 생략한 이미지에는 표시하지 마. 기존 본문·SEO는 소급 변경하지 말고, 실제 이미지 자동 삽입과 이 편집용 자리 표시를 구분해줘. 새 초안은 이미지 자리 표시까지 확정한 뒤 같은 Markdown으로 HTML 미리보기를 최종 생성하거나 갱신해줘.
최종 응답에는 본문·SEO·HTML 미리보기·이미지 가이드 및 실제 생성된 이미지 파일 링크와 권한 확인 필요·오류 사항을 알려줘. 로그인·업로드·게시 API·자동 게시는 하지 마.
```

한 단계만 재실행할 때는 `$fact-check research/YYYY-MM-DD/의 해당 주제를 다시 검증해줘`처럼 입력한다. Skill이 목록에 보이지 않으면 해당 `.agents/skills/<name>/SKILL.md`를 읽고, 없으면 `skill-staging/<name>/SKILL.md`를 경로로 지정해 읽도록 요청한다. 새 세션에서 프로젝트 루트를 다시 열어 인식 여부를 확인한다.
