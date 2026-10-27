import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepare,conceptSVG} from './prepare-images.mjs';

const diagram={title:'개념',root:'검증 사실',leftTitle:'경로 A',rightTitle:'경로 B',leftLines:['조건 A'],rightLines:['조건 B'],footer:'실제 화면 아님'};
test('SVG contains inert text and no executable user markup',()=>{
 const svg=conceptSVG({...diagram,root:'<script>x</script>'});
 assert.ok(svg.includes('&lt;script&gt;'));
 assert.doesNotMatch(svg,/<script|<image|<foreignObject|href=/);
 assert.throws(()=>conceptSVG({...diagram,title:'가'.repeat(25)}));
});
test('uncertain external rights do not create files; render failure preserves guide and originals',async()=>{
 const root=await mkdtemp(join(tmpdir(),'ai-blog-images-'));
 const body='posts/drafts/2026-10-17-test.md';
 await mkdir(join(root,'posts/drafts'),{recursive:true});
 await writeFile(join(root,body),'# 제목\n\n## 위치\n\n내용');
 const candidate={id:'test',type:'external',content:'공식 후보',sourceUrl:'https://example.com',provider:'제공자',rights:'미확인',useStatus:'사용자 확인 필요',position:'위치',reason:'설명',caption:'캡션',alt:'대체 설명',decision:'보류',evidence:'검증 F01'};
 const plan={body,checkedOn:'2026-10-17',researchDir:'research/test',summary:'시험',errors:[],candidates:[candidate]};
 const before=await readFile(join(root,body));
 const first=await prepare(plan,root);
 assert.equal(first.assets.length,0);
 const priorGuide=await readFile(first.guide);
 const second=await prepare({...plan,candidates:[{...candidate,type:'concept',decision:'생성',diagram:{...diagram,title:'가'.repeat(25)}}]},root);
 assert.equal(second.assets.length,0);
 assert.equal(second.errors.length,1);
 assert.notEqual(first.guide,second.guide);
 assert.deepEqual(await readFile(first.guide),priorGuide);
 assert.deepEqual(await readFile(join(root,body)),before);
 await assert.rejects(prepare({...plan,candidates:[{...candidate,id:'../../escape'}]},root),/ID/);
});
