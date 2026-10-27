#!/usr/bin/env python3
"""Validate local artifacts without accessing the web or changing files.

Frontmatter uses a deliberately small YAML subset: two unquoted scalar fields.
This checks that subset, not arbitrary YAML or semantic factual correctness.
Exit 0: complete, 1: artifact errors, 2: canonical skill installation pending.
"""
from pathlib import Path
from datetime import date as calendar_date
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
NAMES = ('topic-research', 'community-research', 'fact-check',
         'blog-writer', 'search-visibility-review')
REQUIRED = (
    'AGENTS.md', 'README.md', 'guidelines/topic-policy.md',
    'guidelines/source-policy.md', 'guidelines/editorial-guide.md',
    'guidelines/search-visibility-policy.md', 'topics/published.md',
    'topics/candidates.md', 'prompts/daily-run.md',
    'templates/blog-post.md', 'templates/review-checklist.md',
)
errors, pending = [], []

for name in REQUIRED:
    p = ROOT / name
    if not p.is_file() or not p.read_text().strip():
        errors.append(f'Missing or empty: {name}')

for name in NAMES:
    canonical = ROOT / '.agents/skills' / name / 'SKILL.md'
    p = canonical
    if not p.is_file():
        pending.append(str(canonical.relative_to(ROOT)))
        p = ROOT / 'skill-staging' / name / 'SKILL.md'
    if not p.is_file():
        errors.append(f'Skill content missing: {name}')
        continue
    s = p.read_text()
    m = re.match(r'\A---\n(.*?)\n---\n(.+)', s, re.S)
    if not m:
        errors.append(f'Invalid frontmatter: {p.relative_to(ROOT)}')
        continue
    fields = {}
    for line in m[1].splitlines():
        pair = re.fullmatch(r'(name|description): ([^\n]+)', line)
        if not pair or pair[1] in fields:
            errors.append(f'Invalid/duplicate field: {p.relative_to(ROOT)}')
            continue
        fields[pair[1]] = pair[2]
        # Reserved YAML prefixes or colon-space require quoting, outside this subset.
        if pair[2][0] in '[{!&*|>\'"%@`' or ': ' in pair[2] or ' #' in pair[2]:
            errors.append(f'Unsupported YAML scalar: {p.relative_to(ROOT)}')
    if fields.get('name') != name or not fields.get('description'):
        errors.append(f'Wrong name or missing description: {p.relative_to(ROOT)}')
    if len(name) >= 64 or not re.fullmatch('[a-z0-9-]+', name):
        errors.append(f'Invalid skill name: {name}')

# Check literal local Markdown links. Prose paths and templates are intentionally excluded.
for p in ROOT.rglob('*.md'):
    if any(x in p.parts for x in ('.git', 'node_modules')):
        continue
    for target in re.findall(r'\]\(([^\n)]+)\)', p.read_text()):
        if target.startswith(('https://', 'http://', '#', 'mailto:')) or '{{' in target:
            continue
        target = target.split('#')[0].strip('<>')
        if target and not (p.parent / target).exists():
            errors.append(f'Broken local link: {p.relative_to(ROOT)} -> {target}')

# Validate both directions of body/SEO pairing and the actual research folder.
draft_dir = ROOT / 'posts/drafts'
for p in draft_dir.glob('*.md'):
    # Image placement guides are companion artifacts, not additional articles.
    if re.search(r'-image-guide(?:-v\d+)?\.md$', p.name):
        continue
    if p.stem.endswith('-seo'):
        body = p.with_name(p.stem[:-4] + '.md')
        if not body.is_file():
            errors.append(f'Orphan SEO file: {p.name}')
        continue
    match = re.fullmatch(r'(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md', p.name)
    if not match:
        errors.append(f'Invalid draft filename: {p.name}')
        continue
    day, slug = match.groups()
    try:
        calendar_date.fromisoformat(day)
    except ValueError:
        errors.append(f'Invalid draft date: {p.name}')
        continue
    seo = p.with_name(p.stem + '-seo.md')
    if not seo.is_file():
        errors.append(f'SEO companion missing: {p.name}')
        continue
    if not p.read_text().strip() or not seo.read_text().strip():
        errors.append(f'Empty draft or SEO file: {p.name}')
    if '{{' in p.read_text() or '{{' in seo.read_text():
        errors.append(f'Unfilled draft/SEO template: {p.name}')
    paths = re.findall(r'^Research Directory: (.+)$', seo.read_text(), re.M)
    if len(paths) != 1:
        errors.append(f'Exactly one Research Directory required: {seo.name}')
        continue
    relative = paths[0].strip().rstrip('/')
    allowed = (f'research/{day}', f'research/{day}/{slug}')
    if relative not in allowed:
        errors.append(f'Research date/slug mismatch: {seo.name} -> {relative}')
        continue
    research_dir = ROOT / relative
    for name in ('topic-candidates', 'official-research', 'community', 'fact-check'):
        artifact = research_dir / (name + '.md')
        if not artifact.is_file() or not artifact.read_text().strip():
            errors.append(f'Research missing or empty: {relative}/{name}.md')
            continue
        slugs = re.findall(r'^주제 slug: (.+)$', artifact.read_text(), re.M)
        if slugs != [slug]:
            errors.append(f'Research topic mismatch: {relative}/{name}.md')

snapshot = ROOT / 'research/2026-10-17/original-files.json'
if snapshot.is_file():
    for name, digest in json.loads(snapshot.read_text()).items():
        p = ROOT / name
        if not p.exists():
            errors.append(f'Original deleted: {name}')
            continue
        data = p.read_bytes()
        if name == 'AGENTS.md':
            data = data.split(b'\n\n## Operating Policies and Skills')[0]
        if hashlib.sha256(data).hexdigest() != digest:
            errors.append(f'Original content changed: {name}')

print(f'Local artifact errors: {len(errors)}')
for message in errors:
    print('ERROR:', message)
print(f'Canonical skill installations pending: {len(pending)}')
for path in pending:
    print('PENDING:', path)
print('Scope: structure, simple YAML subset, local links, draft pairs, research date/slug, original preservation.')
print('Not verified: web facts, editorial quality, runtime skill discovery, search visibility.')
sys.exit(1 if errors else 2 if pending else 0)
