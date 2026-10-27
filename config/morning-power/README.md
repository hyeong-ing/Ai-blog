# 로컬 아침 전원 예약

goguma와 macOS LaunchAgent를 이용해 한국 시간 07:20~08:20의 작업 환경을 제공한다. 실제 Codex 자동화는 앱에서 별도로 등록한다.

| 시간 | 동작 |
| --- | --- |
| 07:20 | goguma가 Mac을 깨우고 `morning-awake` LaunchAgent가 잠자기 방지를 시작 |
| 07:30 | 별도로 등록한 Codex 자동화 실행 |
| 08:20 | 유지용 프로그램 종료 후 `morning-sleep` LaunchAgent가 사용 상태를 확인 |

최근 5분 내 입력, 앱의 잠자기 방지 신호, 상태 확인 실패 중 하나라도 있으면 그날 자동 잠자기를 건너뛴다. 이후에는 macOS의 유휴 잠자기 설정이 적용된다. 입력 없이 화면만 읽는 상황까지 완벽하게 구분하지는 못한다. Codex 작업 완료 여부를 직접 감지하는 방식이 아니므로 작업이 08:20을 넘으면 일시 중단될 수 있다.

## 파일과 설치 위치

- 원본: `scripts/morning-power.py`
- 실행 사본: `~/Library/Application Support/ai-blog-power/morning-power.py`
- LaunchAgent: `~/Library/LaunchAgents/local.ai-blog.morning-awake.plist` 및 `local.ai-blog.morning-sleep.plist`
- 날짜별 로그: `~/Library/Application Support/ai-blog-power/YYYY-MM-DD.jsonl`
- 표준 출력·오류: 같은 폴더의 `run.stdout.log`, `run.stderr.log`, `sleep.stdout.log`, `sleep.stderr.log`

저장소에는 개인 경로를 제거한 `.plist.example` 두 개만 공유한다. 실제 `.plist` 파일은 업로드하지 않는다. 템플릿의 `__PYTHON__`에는 사용할 Python 3 실행 파일의 절대 경로를, `__APP_SUPPORT__`에는 위 실행 사본이 있는 폴더의 절대 경로를 넣는다. `launchd`는 `~`나 셸 변수를 자동 확장하지 않는다. 실제 경로로 치환하고 `plutil -lint`로 검사한 뒤 사용자 LaunchAgents에 설치한다. 템플릿을 그대로 실행하지 않는다.

전원 관리 코드는 Python 표준 라이브러리를 사용한다. goguma CLI와 해당 daemon/helper는 별도 설치가 필요하며, 현재 코드는 `~/.local/bin/goguma`를 사용한다. goguma의 wake 예약은 오전 07:21에 1분의 wake buffer를 적용해 07:20에 깨우도록 구성한다. 저장소 복제만으로 시스템 서비스나 Codex 예약이 설치되지는 않는다.

## 실행과 확인

Mac을 종료·로그아웃하지 않고 Codex 앱을 실행해 둔다. `launchd`는 시스템 로컬 시간, 스크립트와 goguma 예약은 Asia/Seoul을 사용하므로 시스템 시간대를 바꾸면 함께 점검한다.

날짜별 로그에서 `morning_started`, `morning_hold_finished`, `sleep_command_accepted` 또는 `sleep_skipped_activity`를 확인한다. 명령 수락은 실제 잠자기 진입의 증거와 다르므로 `pmset -g log`와 대조한다. Codex 작업 성공은 앱의 실행 결과와 생성 파일로 따로 확인한다.

중지할 때는 goguma의 `ai-blog-morning-wake` 작업을 제거하고 두 LaunchAgent를 `launchctl bootout`으로 해제한다. Codex 자동화는 앱에서 별도로 중지한다.
