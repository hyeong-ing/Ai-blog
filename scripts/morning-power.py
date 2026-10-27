"""Daily 07:20–08:20 Asia/Seoul power window. Jobs run in Codex separately."""
from datetime import datetime
from zoneinfo import ZoneInfo
import fcntl
import json
import re
from pathlib import Path
import subprocess
import sys
import time

TZ = ZoneInfo('Asia/Seoul')
ROOT = Path.home() / 'Library/Application Support/ai-blog-power'
GOGUMA = str(Path.home() / '.local/bin/goguma')


def emit(event, **fields):
    ROOT.mkdir(parents=True, exist_ok=True)
    now = datetime.now(TZ)
    record = dict(at=now.isoformat(), event=event, **fields)
    with (ROOT / (now.strftime('%Y-%m-%d') + '.jsonl')).open('a') as out:
        out.write(json.dumps(record, ensure_ascii=False) + '\n')
    print(json.dumps(record, ensure_ascii=False), flush=True)


def bounds(now):
    return (now.replace(hour=7, minute=20, second=0, microsecond=0),
            now.replace(hour=8, minute=20, second=0, microsecond=0))


def activity_block():
    """Fail closed: recent input, sleep assertions or unknown state skip sleep."""
    try:
        output = subprocess.run(['/usr/sbin/ioreg', '-c', 'IOHIDSystem'],
                                capture_output=True, text=True, timeout=5, check=True).stdout
        match = re.search(r'"HIDIdleTime"\s*=\s*(\d+)', output)
        if not match:
            return 'input_state_unknown'
        if int(match[1]) / 1_000_000_000 < 300:
            return 'input_within_5_minutes'
        output = subprocess.run(['/usr/bin/pmset', '-g', 'assertions'],
                                capture_output=True, text=True, timeout=5, check=True).stdout
        for name in ('PreventSystemSleep', 'PreventUserIdleSystemSleep', 'PreventUserIdleDisplaySleep'):
            match = re.search(r'^\s*' + name + r'\s+(\d+)\s*$', output, re.MULTILINE)
            if not match:
                return 'sleep_assertion_state_unknown'
            if int(match[1]):
                return 'app_preventing_sleep:' + name
    except (OSError, subprocess.SubprocessError):
        return 'activity_check_failed'
    return None


def sleep_at_end():
    now = datetime.now(TZ)
    _, end = bounds(now)
    if not 0 <= (now - end).total_seconds() < 120:
        emit('sleep_skipped_outside_window')
        return
    with (ROOT / 'sleep.lock').open('w') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        marker = ROOT / (now.strftime('%Y-%m-%d') + '.sleep-accepted')
        skipped = ROOT / (now.strftime('%Y-%m-%d') + '.sleep-skipped')
        if marker.exists() or skipped.exists():
            return
        while time.time() < end.timestamp() + 115:
            # Wait for our own morning hold to end before assessing other apps.
            with (ROOT / 'run.lock').open('a') as run_lock:
                try:
                    fcntl.flock(run_lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                except BlockingIOError:
                    time.sleep(1)
                    continue
            reason = activity_block()
            if reason:
                skipped.write_text(reason + '\n')
                emit('sleep_skipped_activity', reason=reason)
                return
            # Let goguma release its helper's global sleep block after the hold.
            emit('sleep_requested')
            try:
                result = subprocess.run(['/usr/bin/pmset', 'sleepnow'],
                                        capture_output=True, text=True, timeout=5)
            except subprocess.TimeoutExpired:
                emit('sleep_command_timeout')
                return
            if result.returncode == 0:
                marker.write_text(datetime.now(TZ).isoformat() + '\n')
                emit('sleep_command_accepted')
                return
            emit('sleep_retry', error=result.stderr.strip())
            time.sleep(3)
        emit('sleep_failed')


def main():
    ROOT.mkdir(parents=True, exist_ok=True)
    mode = sys.argv[1]
    if mode == 'hold-worker':
        deadline = float(sys.argv[2])
        while time.time() < deadline:
            time.sleep(max(0, min(1, deadline - time.time())))
        return
    if mode == 'sleep':
        sleep_at_end()
        return
    if mode != 'run':
        raise SystemExit('Expected run, sleep or hold-worker')
    now = datetime.now(TZ)
    start, end = bounds(now)
    if not start <= now < end:
        emit('wake_service_loaded_outside_window')
        return
    with (ROOT / 'run.lock').open('w') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        emit('morning_started', until=end.isoformat())
        subprocess.run(['/usr/bin/pmset', '-g', 'sched'], timeout=5)
        command = [GOGUMA, 'run', '--label', 'ai-blog-morning-0720-0820', '--',
                   sys.executable, str(Path(__file__).resolve()), 'hold-worker', str(end.timestamp())]
        process = subprocess.Popen(command)
        try:
            code = process.wait(timeout=max(1, end.timestamp() - time.time() + 5))
            emit('morning_hold_finished', exit_code=code)
        except subprocess.TimeoutExpired:
            process.terminate()
            emit('hold_wrapper_timeout')
        # Fixed-time sleep is a separate LaunchAgent, enabled independently.


if __name__ == '__main__':
    main()
