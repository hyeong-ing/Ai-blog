import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { renderDocument, writePreview } from './render-preview.mjs';

test('GFM structure, literal code and Korean prose survive rendering', () => {
  const source = '# 한국어 제목\n\n문장 **강조**와 [출처](https://example.com/a?q=1&b=2).\n\n| 항목 | 값 |\n| --- | --- |\n| 설명 | 그대로 |\n\n```html\n<div>코드</div>\n```\n\n> 인용\n\n1. 첫 단계\n2. 둘째 단계\n';
  const html = renderDocument(source);
  assert.match(html, /<h1>한국어 제목<\/h1>/);
  assert.match(html, /문장 <strong>강조<\/strong>와 <a href="https:\/\/example.com\/a\?q=1&amp;b=2"/);
  assert.match(html, /<table>/);
  assert.match(html, /<td>그대로<\/td>/);
  assert.match(html, /&lt;div&gt;코드&lt;\/div&gt;/);
  assert.match(html, /<blockquote>/);
  assert.match(html, /<ol>/);
});

test('untrusted HTML, script URLs and media remain inert', () => {
  const html = renderDocument(`<script>alert(1)</script>\n\n<iframe src="https://evil.test"></iframe>\n\n<img src=x onerror="alert(1)">\n\n[나쁜 링크](javascript:alert%281%29)\n\n[인코딩](javascript&#58;alert%281%29)\n\n![그림 설명](https://evil.test/track.png)\n\n[파일](file:///etc/passwd)\n`);
  assert.doesNotMatch(html, /<(script|iframe|img|object|embed)\b/i);
  assert.doesNotMatch(html, /href="(?:javascript|file|data):/i);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /그림 설명/);
  assert.match(html, /script-src 'none'/);
  assert.match(html, /connect-src 'none'/);
});

test('originals and earlier previews are preserved on repeat runs', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ai-blog-preview-'));
  const input = join(dir, 'article.md');
  const output = join(dir, 'previews');
  await writeFile(input, '# 원문\n\n변경하지 않는다.\n');
  const before = await readFile(input);
  const first = await writePreview(input, output);
  const original = await readFile(first);
  const second = await writePreview(input, output);
  assert.notEqual(first, second);
  assert.match(second, /article-v2\.html$/);
  assert.deepEqual(await readFile(input), before);
  assert.deepEqual(await readFile(first), original);
  await assert.rejects(writePreview(join(dir, 'article-seo.md'), output), /SEO/);
});
