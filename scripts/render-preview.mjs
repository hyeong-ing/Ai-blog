#!/usr/bin/env node
// Offline build-time Markdown renderer. No JavaScript is included in the output.
import { Marked, Renderer } from './vendor/marked/marked.mjs';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname, basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const escape = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

function safeLink(value) {
  // Do not decode arbitrary entities into a URL; URL-like entities are inert.
  if (value.startsWith('#')) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

const renderer = new Renderer();
renderer.html = ({ text }) => escape(text);
renderer.code = ({ text }) => `<pre><code>${escape(text)}\n</code></pre>\n`;
renderer.link = function ({ href, title, tokens }) {
  const label = this.parser.parseInline(tokens);
  const url = safeLink(href);
  if (!url) return label;
  return `<a href="${escape(url)}"${title ? ` title="${escape(title)}"` : ''} rel="noreferrer noopener">${label}</a>`;
};
// Preserve image alternative text without fetching local or remote media.
renderer.image = function ({ tokens }) { return this.parser.parseInline(tokens); };
const markdown = new Marked({ renderer, gfm: true, breaks: false, async: false });

const STYLE = `
:root { color-scheme: light; --ink:#242a32; --muted:#606b78; --line:#dfe5eb; --accent:#18578e; }
* { box-sizing:border-box; }
body { margin:0; background:#f3f5f7; color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif; font-size:18px; line-height:1.9; word-break:keep-all; overflow-wrap:anywhere; }
main { max-width:900px; margin:48px auto; padding:52px 64px 64px; background:#fff; border:1px solid var(--line); border-radius:16px; box-shadow:0 8px 40px #18293a08; }
aside { margin-bottom:30px; color:var(--muted); font-size:13px; letter-spacing:.04em; }
h1,h2,h3,h4,h5,h6 { line-height:1.45; color:#172637; letter-spacing:-.035em; }
h1 { font-size:2.15rem; margin:0 0 28px; }
h2 { font-size:1.5rem; margin:48px 0 18px; padding-top:12px; border-top:1px solid var(--line); }
h3 { font-size:1.2rem; margin:30px 0 12px; }
p { margin:0 0 22px; }
ul,ol { padding-left:1.5em; margin:18px 0 26px; }
li { padding-left:5px; margin:8px 0; }
a { color:var(--accent); text-underline-offset:4px; text-decoration-thickness:1px; }
a:hover { color:#103d64; }
a:focus-visible { outline:2px solid var(--accent); outline-offset:3px; }
strong { color:#142c43; font-weight:700; }
blockquote { margin:24px 0; padding:12px 22px; border-left:4px solid #8bb1d0; background:#f3f7fb; }
blockquote p:last-child { margin-bottom:0; }
pre { overflow-x:auto; max-width:100%; padding:22px; background:#182332; color:#e9eff5; border-radius:10px; line-height:1.65; font-size:14px; white-space:pre; word-break:normal; overflow-wrap:normal; }
code { font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.87em; }
:not(pre)>code { padding:3px 6px; background:#eef2f6; border-radius:4px; }
table { display:block; max-width:100%; overflow-x:auto; border-collapse:collapse; margin:24px 0; font-size:.9em; }
th,td { border:1px solid var(--line); padding:12px 16px; text-align:left; min-width:110px; vertical-align:top; }
th { background:#edf3f8; font-weight:700; }
tr:nth-child(even) td { background:#fafbfd; }
hr { border:0; border-top:1px solid var(--line); margin:36px 0; }
@media(max-width:640px) { body { font-size:16px; } main { margin:0; padding:28px 22px 40px; border:0; border-radius:0; box-shadow:none; } h1 { font-size:1.8rem; } h2 { font-size:1.3rem; margin-top:36px; } pre { padding:16px; } }
@media print { body { background:#fff; } main { margin:0; padding:0; border:0; box-shadow:none; max-width:none; } aside { display:none; } pre { white-space:pre-wrap; } }
`;

export function renderDocument(source, name = 'blog.md') {
  const title = source.match(/^#\s+(.+)$/m)?.[1] || name;
  const sha = createHash('sha256').update(source).digest('hex');
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src 'none'; font-src 'none'; connect-src 'none'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="no-referrer">
<meta name="source-sha256" content="${sha}">
<title>${escape(title)}</title>
<style>${STYLE}</style>
</head>
<body><main>
<aside aria-label="미리보기 정보">DRAFT · Markdown 미리보기 · ${escape(name)}</aside>
<article>${markdown.parse(source)}</article>
</main></body>
</html>
`;
}

export async function writePreview(input, outputDir = join(ROOT, 'posts/previews')) {
  const path = resolve(input);
  if (extname(path).toLowerCase() !== '.md' || /-(?:seo|image-guide(?:-v\d+)?)\.md$/i.test(path)) {
    throw new Error('본문 .md 파일만 지정하세요. SEO·이미지 가이드는 변환하지 않습니다.');
  }
  const source = await readFile(path, 'utf8');
  const html = renderDocument(source, basename(path));
  await mkdir(outputDir, { recursive: true });
  const stem = basename(path, extname(path));
  for (let revision = 1; ; revision++) {
    const target = join(outputDir, `${stem}${revision === 1 ? '' : `-v${revision}`}.html`);
    try {
      await writeFile(target, html, { encoding: 'utf8', flag: 'wx' });
      return target;
    } catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Usage: node scripts/render-preview.mjs posts/drafts/YYYY-MM-DD-topic.md');
    process.exitCode = 1;
  } else {
    try { console.log(await writePreview(args[0])); }
    catch (error) { console.error(`HTML preview failed: ${error.message}`); process.exitCode = 1; }
  }
}
