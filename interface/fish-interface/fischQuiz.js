(() => {
  let pool = [], fish = [], catalog = [], questions = [], position = 0, correct = 0, mistakes = [], answered = false, unlimited = false;
  const byId = id => document.getElementById(id);
  const start = byId('start_btn');
  async function getJson(url) { const response = await fetch(url); if (!response.ok) throw new Error('Daten nicht verfügbar'); return response.json(); }
  const shuffle = items => { const copy = [...items]; for (let i=copy.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; } return copy; };
  function makeQuestion() {
    if (!pool.length) pool=shuffle([...catalog.map(q=>({text:q.question, options:shuffle(q.choices), answer:q.correct, explanation:q.explanation, source:q.source, source_label:q.source_label})), ...fish.map(target=>({text:'Welcher Fisch ist das?',image:'../../'+target.image,credit:target,options:shuffle([target.name,...shuffle(fish.filter(f=>f.name!==target.name)).slice(0,3).map(f=>f.name)]),answer:target.name,explanation:target.name+' · '+target.scientific_name}))]);
    return pool.pop();
  }
  function credit(q) {
    const box=byId('quiz_credit');box.replaceChildren();if(!q.credit)return;
    box.append(document.createTextNode('Bild: '+q.credit.image_author+' · '));
    const link=document.createElement('a');link.href=q.credit.image_source;link.target='_blank';link.rel='noopener';link.textContent='Quelle';box.append(link,document.createTextNode(' · '));
    if(q.credit.image_license_url){const license=document.createElement('a');license.href=q.credit.image_license_url;license.textContent=q.credit.image_license;box.append(license);}else box.append(document.createTextNode(q.credit.image_license));
  }
  function showQuestion() {
    answered=false;
    const q=questions[position] || (questions[position]=makeQuestion());
    byId('quiz_progress').textContent=`Frage ${position+1}${unlimited?'':` von ${questions.length}`}`;
    credit(q);
    const image=byId('quiz_image'); image.hidden=!q.image; image.alt=q.image?'Fisch zur Bestimmung':'';
    if(q.image) image.src=q.image; else image.removeAttribute('src');
    image.onerror=()=> { image.hidden=true; answered=false; byId('quiz_options').replaceChildren(); byId('quiz_question').textContent='Bild nicht verfügbar. Bitte fahre mit der nächsten Frage fort.'; byId('next_btn').hidden=false; };
    byId('quiz_question').textContent=q.text; byId('quiz_feedback').textContent=''; byId('next_btn').hidden=true;
    const options=byId('quiz_options'); options.replaceChildren();
    q.options.forEach(text=>{ const button=document.createElement('button'); button.type='button';button.textContent=text;button.addEventListener('click',()=>{
      if(answered)return; answered=true;
      if(text===q.answer){correct++;byId('quiz_feedback').textContent='Richtig!';}
      else{mistakes.push({question:q.text, selected:text, answer:q.answer});byId('quiz_feedback').textContent=`Die richtige Antwort ist: ${q.answer}`;}
      byId('quiz_feedback').append(document.createTextNode(' '+(q.explanation||'')));
      if(q.source){const link=document.createElement('a');link.href=q.source;link.target='_blank';link.rel='noopener';link.textContent=' '+q.source_label;byId('quiz_feedback').append(link);}
      options.querySelectorAll('button').forEach(b=>b.disabled=true);byId('next_btn').hidden=false;byId('next_btn').focus();
    });options.append(button);});
  }
  function finish() {
    byId('quiz_area').style.display='none';byId('start_screen').style.display='block';
    const result=byId('quiz_result');result.style.display='block';result.replaceChildren();
    const title=document.createElement('h2');title.textContent='Dein Ergebnis';result.append(title);
    const summary=document.createElement('p');const total=position+(answered?1:0);summary.textContent=`${correct} von ${total} beantworteten Fragen richtig.`;result.append(summary);
    if(mistakes.length){const list=document.createElement('ul');mistakes.forEach(m=>{const item=document.createElement('li');item.textContent=`${m.question} Deine Antwort: ${m.selected}. Richtig: ${m.answer}.`;list.append(item);});result.append(list);}
    start.textContent='Neues Quiz starten';start.focus();
  }
  start.addEventListener('click',()=>{ const length=Number(byId('quiz_length').value);if(!Number.isInteger(length)||length<0||length>100){byId('quiz_result').textContent='Bitte wähle eine ganze Zahl zwischen 0 und 100.';byId('quiz_result').style.display='block';return;}unlimited=length===0;pool=[];questions=Array.from({length:unlimited?1:length},makeQuestion);position=0;correct=0;mistakes=[];answered=false;byId('start_screen').style.display='none';byId('quiz_result').style.display='none';byId('quiz_area').style.display='block';showQuestion(); });
  byId('next_btn').addEventListener('click',()=>{position++;if(!unlimited&&position>=questions.length){answered=false;finish();}else{answered=false;showQuestion();}});
  byId('stop_btn').addEventListener('click',finish);
  Promise.all([getJson('../../quiz-assets/images.json'),getJson('../../sources/sana/sana_questions.json').catch(()=>[])]).then(([f,q])=>{fish=f.filter(x=>x.name&&x.image);catalog=q.filter(x=>x.question&&Array.isArray(x.choices)&&x.choices.includes(x.correct));if(fish.length<4)throw new Error();start.disabled=false;start.textContent='Quiz starten';}).catch(()=>{start.textContent='Daten nicht verfügbar – Seite neu laden';start.disabled=true;});
})();
