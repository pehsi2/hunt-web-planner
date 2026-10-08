"use strict";
const byId = id => document.getElementById(id);
let db=null;
const emojis={'Normal':'⚪','Fogo':'🔥','Água':'💧','Elétrico':'⚡','Planta':'🌿','Gelo':'❄️','Lutador':'🥊','Veneno':'☠️','Terrestre':'🌍','Voador':'🕊️','Psíquico':'🔮','Inseto':'🐛','Pedra':'🪨','Fantasma':'👻','Dragão':'🐉','Sombrio':'🌑','Aço':'⚙️','Fada':'✨'};
const selected=()=>[...new Set(['type1','type2','type3'].map(id=>byId(id).value).filter(t=>t!=='Nenhum'))];
function multiplier(types,attack){return types.reduce((m,t)=>m*(db.matrix[t]?.[attack]??1),1)}
function rankAreas(types){
 const map=new Map();
 for(const r of db.rows){
  const key=JSON.stringify([r.region,r.zone,r.area,r.level]);
  if(!map.has(key))map.set(key,{region:r.region,zone:r.zone,area:r.area,level:r.level,entries:[],scores:Object.fromEntries(types.map(t=>[t,0]))});
  const a=map.get(key);a.entries.push(r);
  for(const t of types)if(multiplier(r.types,t)>=2)a.scores[t]+=r.weight;
 }
 return [...map.values()].map(a=>{
  for(const t of types)a.scores[t]=Math.min(1,a.scores[t]);
  a.total=types.reduce((s,t)=>s+a.scores[t],0);
  a.averageCatch=[...new Set(a.entries.map(r=>r.pokemon))].map(p=>a.entries.find(r=>r.pokemon===p)?.catch).filter(v=>typeof v==='number');
  a.averageCatch=a.averageCatch.length?a.averageCatch.reduce((s,v)=>s+v,0)/a.averageCatch.length:null;
  return a;
 }).filter(a=>types.length&&a.total>0).sort((a,b)=>{
  for(const t of types){const d=b.scores[t]-a.scores[t];if(Math.abs(d)>1e-9)return d;}
  return a.region.localeCompare(b.region,'pt-BR')||a.zone.localeCompare(b.zone,'pt-BR')||a.area-b.area||a.level-b.level;
 });
}
function node(tag,className,value){const e=document.createElement(tag);if(className)e.className=className;if(value!==undefined)e.textContent=value;return e}
const fmt=p=>`${Math.round(p*100)}%`;
const label=a=>`${a.region} · ${a.zone} · Área ${a.area}`;
function render(){if(!db)return;const types=selected(),ranked=rankAreas(types),featured=ranked.slice(0,3),others=ranked.slice(3,8);

 byId('topCards').replaceChildren(...featured.map((a,i)=>{
  const card=node('article',`area-card ${i===1?'silver':i===2?'bronze':''}`);
  card.append(node('div','medal',['🥇 1º LUGAR','🥈 2º LUGAR','🥉 3º LUGAR'][i]||`#${i+1} · ÁREA`),node('h3','',label(a)));
  const stats=node('div','stats');
  const infoLine=node('div','info-line');
  infoLine.append(node('span','stat',`Lv. ${a.level}`),node('span','stat',a.averageCatch===null?'Catch potential indisponível':`Catch potential médio ${a.averageCatch.toFixed(1)}`));
  stats.append(infoLine);
  const questLine=node('div','quest-line');
  for(const t of types)questLine.append(node('span','stat quest',`${emojis[t]||''} ${t} ${fmt(a.scores[t])}`));
  stats.append(questLine);
  const speciesBox=node('div','species-list');
  const unique=[...new Map(a.entries.map(r=>[r.pokemon,r])).values()];
  for(const r of unique){
    const item=node('span','species-item');
    item.append(node('span','species-name',r.pokemon));
    item.append(node('span','species-types',(r.types||[]).map(t=>emojis[t]||'').filter(Boolean).join(' ')));
    item.append(node('span','species-catch',`— ${r.catch??'—'}`));
    speciesBox.append(item);
  }
  card.append(stats,speciesBox);return card;
 }));
 byId('otherCards').replaceChildren(...others.map(a=>{const row=node('div','compact');row.append(node('span','',`${label(a)} · Lv. ${a.level}`),node('span','other-quests',types.map(t=>`${emojis[t]||''} ${t} ${fmt(a.scores[t])}`).join('  ·  ')));return row}));
 document.querySelector('.second').hidden=!others.length;
}
for(const id of ['type1','type2','type3'])byId(id).addEventListener('change',render);
for(const id of ['catchType1','catchType2'])byId(id).addEventListener('change',renderCapture);
for(const b of document.querySelectorAll('[data-tab]'))b.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===b.dataset.tab))});
fetch('./data.json').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(d=>{db=d;byId('type1').value='Fogo';byId('type2').value='Elétrico';byId('type3').value='Nenhum';byId('catchType1').value='Lutador';byId('catchType2').value='Nenhum';render();renderCapture()}).catch(err=>{byId('topCards').append(node('p','',`Erro ao carregar data.json: ${err.message}. Abra pelo GitHub Pages ou use um servidor local, não file://.`))});

// Planner de Captura v0.6: ranking inicial independente, sem alterar Fraquezas.
function rankCapture(){
 const types=[...new Set(['catchType1','catchType2'].map(id=>byId(id).value).filter(x=>x!=='Nenhum'))];
 if(!types.length)return [];
 const areas=new Map();
 for(const r of db.rows){
  if(!r.types?.some(t=>types.includes(t))||typeof r.catch!=='number')continue;
  const key=JSON.stringify([r.region,r.zone,r.area,r.level]);
  if(!areas.has(key))areas.set(key,{region:r.region,zone:r.zone,area:r.area,level:r.level,matched:new Map()});
  areas.get(key).matched.set(r.pokemon,r);
 }
 return [...areas.values()].map(a=>{
  a.species=[...a.matched.values()];
  a.average=a.species.reduce((s,r)=>s+r.catch,0)/a.species.length;
  return a;
 }).sort((a,b)=>a.average-b.average||a.level-b.level||b.species.length-a.species.length||a.region.localeCompare(b.region,'pt-BR')||a.zone.localeCompare(b.zone,'pt-BR')||a.area-b.area).slice(0,9);
}
function renderCapture(){
 if(!db)return;
 const cards=rankCapture();
 byId('captureCards').replaceChildren(...cards.map((a,i)=>{
  const card=node('article',`area-card capture-card ${i===1?'silver':i===2?'bronze':''}`);
  card.append(node('div','medal',`#${i+1} · CAPTURA`),node('h3','',label(a)));
  const info=node('div','info-line');
  info.append(node('span','stat',`Lv. ${a.level}`),node('span','stat',`Catch médio ${a.average.toFixed(1)}`),node('span','stat',`${a.species.length} espécie(s)`));
  const speciesBox=node('div','species-list');
  for(const r of a.species){
   const item=node('span','species-item');
   item.append(node('span','species-name',r.pokemon),node('span','species-types',r.types.map(t=>emojis[t]||'').join(' ')),node('span','species-catch',`— ${r.catch}`));
   speciesBox.append(item);
  }
  card.append(info,speciesBox);return card;
 }));
 if(!cards.length)byId('captureCards').append(node('p','', 'Selecione pelo menos um tipo para encontrar áreas de captura.'));
}
