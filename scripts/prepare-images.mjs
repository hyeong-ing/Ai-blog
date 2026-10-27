#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const xml = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const md = s => String(s ?? '').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,' ');

export function conceptSVG(d) {
 const keys=['title','root','leftTitle','rightTitle','footer'];
 const lines=[...(d.leftLines || []),...(d.rightLines || [])];
 if (keys.some(k=>typeof d[k]!=='string'||!d[k]) ||
     !Array.isArray(d.leftLines)||!Array.isArray(d.rightLines)||
     d.leftLines.length>3||d.rightLines.length>3||
     [...keys.map(k=>d[k]),...lines].some(s=>typeof s!=='string'||[...s].length>24)) throw new Error('개념도 문구/줄 수 제한 위반');
 // Editorial monochrome layout: hierarchy and whitespace instead of decorated cards.
 const text=(x,y,s,size=26,weight=400,fill='#222')=>`<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}">${xml(s)}</text>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760" role="img" aria-labelledby="title desc">
<title id="title">${xml(d.title)}</title><desc id="desc">설명용 개념도. 실제 제품 화면 아님.</desc>
<rect width="1200" height="760" fill="#fff"/><g font-family="Apple SD Gothic Neo,Malgun Gothic,sans-serif">
${text(80,96,d.title,44,700,'#111')}
${text(80,140,'설명용 개념도 · 실제 제품 화면 아님',22,400,'#555')}
<path d="M80 180 H1120" stroke="#222" stroke-width="2"/>
${text(80,238,d.root,28,600)}
<path d="M80 280 H560 M640 280 H1120" stroke="#aaa" stroke-width="1"/>
${text(80,338,d.leftTitle,32,700,'#111')}${text(640,338,d.rightTitle,32,700,'#111')}
${d.leftLines.map((s,i)=>text(80,396+i*48,s)).join('')}
${d.rightLines.map((s,i)=>text(640,396+i*48,s)).join('')}
<path d="M80 590 H1120" stroke="#aaa" stroke-width="1"/>
${text(80,643,d.footer,28,600)}
${text(80,700,'공개 자료 기반 · 성능·비용 우열을 나타내지 않음',22,400,'#555')}
</g></svg>`;
}

async function unique(dir, stem, ext, content) {
 await mkdir(dir,{recursive:true});
 for(let n=1;;n++) {
  const path=join(dir,`${stem}${n===1?'':`-v${n}`}.${ext}`);
  try { await writeFile(path,content,{encoding:'utf8',flag:'wx'}); return path; }
  catch(e) { if(e.code!=='EEXIST') throw e; }
 }
}

export async function prepare(plan, root=ROOT) {
 if(!/^posts\/drafts\/\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/.test(plan.body) || /-(seo|image-guide)\.md$/.test(plan.body)) throw new Error('본문 경로 오류');
 if(!Array.isArray(plan.candidates)||!Array.isArray(plan.errors)) throw new Error('후보/오류 배열 필요');
 const body=await readFile(join(root,plan.body),'utf8');
 const sha=createHash('sha256').update(body).digest('hex');
 const stem=basename(plan.body,'.md');
 const assetDir=join(root,'posts/assets',stem);
 const errors=[...plan.errors];
 const sections=[]; const assets=[];
 for(const c of plan.candidates) {
  let generated=null;
  const fields=['id','type','content','sourceUrl','provider','rights','useStatus','position','reason','caption','alt','decision','evidence'];
  if(fields.some(k=>typeof c[k]!=='string'||!c[k])) throw new Error('후보 메타데이터 누락');
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id) || !['concept','external'].includes(c.type)) throw new Error('후보 ID/유형 오류');
  if(!body.includes(c.position)) throw new Error(`본문에서 위치를 찾을 수 없음: ${c.position}`);
  if(c.type==='concept' && c.diagram && c.decision==='생성') {
   try { generated=await unique(assetDir,`${c.id}-deployment-concept`,'svg',conceptSVG(c.diagram)); assets.push(generated); }
   catch(e) {errors.push(`${c.id} 렌더링/저장 실패: ${e.message}`);}
  }
  sections.push(`## ${md(c.id)} · ${md(c.content)}\n\n`+
   [['유형',c.type],['원본 URL',c.sourceUrl],['이미지 파일 URL',c.imageUrl||'미확인'],['제공자',c.provider],['이용 조건',c.rights],['이용 조건 URL',c.rightsUrl||'별도 라이선스 미지정'],['블로그 사용 확인',c.useStatus],['삽입 위치',c.position],['필요한 이유',c.reason],['캡션',c.caption],['대체 텍스트',c.alt],['선정 결과',c.decision],['검증 근거',c.evidence],['실제 파일',generated?generated:'없음 — 외부 다운로드·화면 캡처 수행 안 함']].map(([k,v])=>`- ${k}: ${md(v)}`).join('\n'));
 }
 const guide=`# 이미지 조사·배치 가이드\n\n상태: DRAFT / 사용자 검토 대기\n확인일: ${md(plan.checkedOn)}\n본문: ${plan.body}\n본문 SHA-256: ${sha}\nResearch Directory: ${md(plan.researchDir)}\n\n${md(plan.summary)}\n\n${sections.join('\n\n')}\n\n## 검색·배치 검토\n\n관련 설명 가까이 삽입하고 구체적인 파일명·캡션·자연스러운 alt를 사용한다. 이미지에만 핵심 정보를 넣지 않는다. 이미지 개수는 순위나 AI 인용을 보장하지 않는다. 게시 시 img src와 파일 접근성·표시 크기를 확인한다. 원본 본문·SEO·기존 미리보기는 수정하지 않았다.\n\n- Google: https://developers.google.com/search/docs/appearance/google-images\n- 네이버: https://searchadvisor.naver.com/guide/content-basic\n- 네이버 alt 안내: https://searchadvisor.naver.com/guide/report-seo\n\n## 오류·후속 작업\n\n${errors.length?errors.map(e=>'- '+md(e)).join('\n'):'- 기록된 실행 오류 없음'}\n\n외부 이미지 권한 확인과 최종 삽입은 사용자 검토 후 진행한다. 현재 HTML 미리보기는 이미지 로딩을 차단하므로 여기에 배치됐다고 간주하지 않는다. 본문/SEO 생성과 이미지 준비 실패는 별개로 보고한다.\n`;
 const guidePath=await unique(join(root,'posts/drafts'),`${stem}-image-guide`,'md',guide);
 return {guide:guidePath,assets,errors};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 try {
  if(process.argv.length!==3) throw new Error('Usage: node scripts/prepare-images.mjs research/.../image-plan.json');
  console.log(JSON.stringify(await prepare(JSON.parse(await readFile(process.argv[2],'utf8'))),null,2));
 } catch(e) {console.error('이미지 준비 실패(본문·SEO 보존): '+e.message);process.exitCode=1;}
}
