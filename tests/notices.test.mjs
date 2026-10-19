import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
const source=stripTypeScriptTypes(fs.readFileSync('src/data/systemNotices.ts','utf8'));
const {importantNotices,localSystemNotices,incomingNotices,noticeSignature}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const hero={chatMessages:[{channel:'world',sender:'ADMIN',text:'fake admin message'}]};
test('new important notices force attention once; unchanged messages and local-mode info do not',()=>{
  const notice={id:'admin-1',source:'admin',severity:'warning',important:true,title:['Oznam','Notice'],message:['Správa','Message']};
  assert.equal(incomingNotices(localSystemNotices(hero),new Set()).length,0);
  assert.deepEqual(incomingNotices([notice],new Set()),[notice]);
  const seen=new Set([noticeSignature(notice)]);
  assert.equal(incomingNotices([{...notice}],seen).length,0);
  assert.equal(incomingNotices([{...notice,message:['Nová správa','Updated message']}],seen).length,1);
  assert.equal(incomingNotices([{...notice,severity:'critical'}],seen).length,1);
  assert.equal(incomingNotices([{...notice,important:false}],new Set()).length,0);
  assert.equal(incomingNotices([notice],new Set()).length,1);
});
test('only explicit important notices enter the mini feed, ordered by severity and deduplicated',()=>{
  const notice={id:'a',source:'server',severity:'info',important:true,title:['SK','EN'],message:['SK','EN']};
  const feed=importantNotices([notice,{...notice,id:'hidden',important:false},{...notice,id:'critical',severity:'critical'},{...notice}]);
  assert.deepEqual(feed.map(entry=>entry.id),['critical','a']);
  assert.equal(importantNotices(Array.from({length:30},(_,index)=>({...notice,id:String(index)}))).length,20);
});
test('local notices do not impersonate server/admin or promote player chat messages',()=>{
  const feed=localSystemNotices(hero);
  assert.equal(feed.length,1);
  assert.equal(feed[0].id,'local-mode');
  assert(feed.every(entry=>entry.source==='system'));
  const warning=localSystemNotices(hero,true,true)[0];
  assert.equal(warning.severity,'critical');
  assert(warning.message[1].includes('Another window'));
});
test('earned rewards appear only for a completed victory with a real receipt',()=>{
  const reward={xp:20,gold:10,items:['Guard boots']};
  const win=localSystemNotices({...hero,battle:{ended:'win',reward}});
  assert.equal(win[0].id,'battle-reward');
  assert(win[0].message[1].includes('20 XP'));
  assert.equal(localSystemNotices({...hero,battle:{ended:'loss',reward}}).length,1);
  assert.equal(localSystemNotices({...hero,battle:{ended:'win'}}).length,1);
});
