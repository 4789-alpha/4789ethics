const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const questions=read('sources/sana/sana_questions.json');
assert.equal(new Set(questions.map(q=>q.id)).size,questions.length,'duplicate IDs');
assert.equal(new Set(questions.map(q=>q.question)).size,questions.length,'duplicate text');
for(const q of questions){assert(q.choices.includes(q.correct),`missing answer ${q.id}`);assert.equal(new Set(q.choices).size,q.choices.length);assert(q.explanation&&q.source&&q.reviewed_on);assert(!q.question.includes('abgebildet'),'unbound image task');}
assert.equal(questions.find(q=>q.id===35).correct,'Wichtigstes Atmungsorgan');
assert.equal(questions.find(q=>q.id===120).correct,'Ja');
assert.match(questions.find(q=>q.id===26).correct,/biologische Vielfalt/);
assert(!questions.some(q=>q.id>=210),'unverified cantonal rules');
const images=read('quiz-assets/images.json');assert(images.length>=4);
for(const image of images){assert(fs.existsSync(path.join(root,image.image)));assert(image.image_author&&image.image_source&&image.image_license);}
const audit=read('sources/sana/quiz-audit-2026.json');assert.equal(audit.length,156);
assert.equal(audit.filter(q=>q.status!=='suspended').length,questions.length);
console.log(`${questions.length} text questions, ${images.length} reference images, 156 audit decisions: OK`);
