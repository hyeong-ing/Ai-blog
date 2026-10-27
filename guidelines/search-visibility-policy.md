# 검색 가시성 정책: SEO / AEO / GEO

최종 공식 자료 확인: 2026-10-17. 검색 순위·색인·AI 인용을 보장하지 않는다. 아래 공통 편집 규칙은 사람의 이해를 돕기 위한 것이며 검색 알고리즘의 공식 채점표가 아니다.

## 공식 근거와 접근 상태

| 공식 자료 | 이번 확인 | 적용 |
| --- | --- | --- |
| [Google AI features](https://developers.google.com/search/docs/appearance/ai-features) | 본문 접근 | 기본 SEO, 색인·스니펫 적격성, 별도 AI 파일·특수 schema 불필요 |
| [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) | 본문 접근 | 독자 가치·명확한 구성, AI 전용 재작성·잘게 나누기·llms.txt에 과도한 기대 금지 |
| [Helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) | 본문 접근 | 단순 재요약을 넘어 독자에게 유용한 비교·해석, 과장 금지 |
| [Structured data 소개](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) | 본문 접근 | 표시되는 내용과 일치, 플랫폼 지원 확인 후 사용 |
| [Title links](https://developers.google.com/search/docs/appearance/title-link) | 본문 접근 | 간결하고 구체적인 제목, 키워드 남용 금지; 검색 제목은 재작성될 수 있음 |
| [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) | 직접 접근은 본문 추출 불가; 공식 페이지의 검색 색인 요약 일부만 확인 | 전체 최신 문서 검증 미완료. 색인 요약을 완독 근거로 삼지 않음 |
| [Bing AI Performance / Topics Portfolio Beta](https://blogs.bing.com/webmaster/2026/10/introducing-topics-portfolio-beta-in-ai-performance/) | 공식 블로그 본문 접근 | 관찰 도구 안내와 콘텐츠 편집을 구분; 계정별 사용 가능 여부는 플랫폼 확정 후 확인 |

추가 확인(2026-10-17): 두 AI 문서의 측정·적격성 안내 차이는 연결된 최신 도움말로 보완했다. [Search generative AI control](https://support.google.com/webmasters/answer/16908024)은 포함·제외 설정을 안내하고, [Generative AI performance report](https://support.google.com/webmasters/answer/16984139)는 전용 보고서와 데이터 부족 시 보이지 않을 수 있음을 설명한다. 따라서 기능 존재 여부는 확인했으며 실제 사이트의 설정·데이터·관리 권한은 플랫폼 확정 후 사람이 확인한다. 보고서가 없다는 사실만으로 설정 오류로 판단하지 않는다. 포함 설정과 색인 적격성이 노출·인용을 보장하지는 않는다.

## 콘텐츠 규칙

- 정확한 제품명·주제를 자연스러운 제목에 쓴다. 키워드를 억지로 반복하거나 글자 수를 채우지 않는다.
- 도입에 핵심 답을 주고 H2/H3로 논점을 구분한다. 용어는 필요한 경우만 짧게 정의한다.
- 이전 대비 변화와 구체적인 활용을 설명하고 버전·날짜·지원 환경·제한을 명시한다.
- 명령·설치·코드는 확인된 자료만 사용한다. 검증되지 않은 사용법을 SEO를 위해 추가하지 않는다.
- 중요한 사실에 직접 근거 링크를 붙인다. 내부 링크는 `topics/published.md`의 실제 게시 URL만 본문에 사용한다. 없으면 SEO 파일에 “없음” 또는 향후 주제 제안만 적는다.
- 표·Before/After·질문과 답은 정보 전달이 좋아질 때만 사용한다. FAQ, 문단 길이, 키워드 밀도, 글자 수에 일률적인 기준을 두지 않는다.

## 공식 권장과 실험적 전략의 구분

SEO는 검색 발견·이해를 돕는 작업, AEO/GEO는 답변형·생성형 검색 가시성을 논의할 때 쓰는 용어로 취급한다. Google 관점에서는 기본 SEO의 연장이다. 특정 단어 수, 통계·인용 개수, FAQ 강제, AI에게 인용을 지시하는 숨은 문구, 가짜 리뷰·평점·외부 언급 구매는 채택하지 않는다.

업계 실험을 다룰 때는 `실험적 가설`로 표시하고 원문, 표본, 대상 서비스·버전, 측정일·방법과 한계를 기록한다. 공식 필수 조건과 섞지 않는다. 본 프로젝트는 그러한 실험을 운영 기본값으로 적용하지 않는다. Google 규칙을 Bing/Copilot/ChatGPT 전체에 일반화하지 않는다. ChatGPT Search의 크롤러 등 서비스별 설정은 필요해질 때 OpenAI 공식 문서로 별도 확인한다.

## 별도 SEO 파일 계약

`posts/drafts/YYYY-MM-DD-topic-seo.md`에 다음을 복사 가능한 값으로 남긴다.

- SEO Title / Meta Description / URL Slug (경로 제안이며 게시 URL 아님)
- Primary Keyword / Secondary Keywords / Category / Tags
- Suggested Internal Links (실제 URL과 이유, 없으면 없음)
- Image Alt Text (실제 이미지별 경로·설명; 없으면 해당 없음)
- 초안 경로 / `Research Directory: research/YYYY-MM-DD/` (추가 주제는 slug 하위 폴더) / 검토 시각 / 확인한 공식 정책 URL
- 체크 결과(통과/수정 필요/미검증/해당 없음), 수정 내용, 남은 사용자 작업
- 검토 상태: 검토 대기. 게시 URL·게시일은 사용자 확인 전 생성하지 않음

메타 설명과 제목이 검색 결과에 그대로 표시된다고 보장하지 않는다. 게시 플랫폼이 해당 입력란을 제공하는지 확인하기 전에는 적용 완료라고 쓰지 않는다.

## 플랫폼에서 별도로 처리할 기술 SEO

플랫폼 선정 후 사람이 지원 여부를 확인한다: title/meta 편집, URL·canonical, robots/noindex·스니펫 제어, sitemap, 모바일 표시·속도, Search Console/Bing Webmaster 소유권 확인. 현재 Markdown 파일 생성으로 이 항목들이 적용되지는 않는다.

Article/BlogPosting은 플랫폼 지원과 해당 공식 필수·권장 속성을 재확인한 경우에만 제안한다. 실제 저자·게시일·수정일·이미지·본문과 일치해야 하며 가짜 리뷰·평점을 넣지 않는다. JSON-LD와 llms.txt는 AI 검색 노출의 필수 조건이 아니다. 이번 작업에서는 사이트 설정·계정 연결·게시 API를 구현하지 않는다.

## 최종 체크

정확한 제목과 날짜 / 도입의 핵심 답 / 의미 있는 소제목 / 비교와 활용 / 근거·제한 / 메타데이터 분리 / 실제 내부 링크·이미지만 / 과장·중복·키워드 남용 없음 / 기술 SEO 미적용 상태 명시 / 인용 보장 없음.
