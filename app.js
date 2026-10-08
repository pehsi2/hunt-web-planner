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
function render(){if(!db)return;const types=selected(),top=Math.max(1,Number(byId('top').value)||3),ranked=rankAreas(types),featured=ranked.slice(0,top),others=ranked.slice(top);
 byId('counter').textContent=`${featured.length} de ${ranked.length} áreas`;
 byId('topCards').replaceChildren(...featured.map((a,i)=>{
  const card=node('article',`area-card ${i===1?'silver':i===2?'bronze':''}`);
  card.append(node('div','medal',['🥇 1º LUGAR','🥈 2º LUGAR','🥉 3º LUGAR'][i]||`#${i+1} · ÁREA`),node('h3','',label(a)));
  const stats=node('div','stats');const values=[`Lv. ${a.level}`,`Pontuação ${fmt(a.total/Math.max(1,types.length))}`,...types.map(t=>`${emojis[t]||''} ${t} ${fmt(a.scores[t])}`),a.averageCatch===null?'Catch potential indisponível':`Catch potential médio ${a.averageCatch.toFixed(1)}`];
  for(const val of values)stats.append(node('span','stat',val));
  const species=[...new Map(a.entries.map(r=>[r.pokemon,r])).values()].map(r=>`${r.pokemon} — ${r.catch??'—'}`);
  card.append(stats,node('p','pokemon',`Pokémon: ${species.join(' · ')}`));return card;
 }));
 byId('otherCards').replaceChildren(...others.map(a=>{const row=node('div','compact');row.append(node('span','',`${label(a)} · Lv. ${a.level}`),node('strong','',fmt(a.total/Math.max(1,types.length))));return row}));
 document.querySelector('.second').hidden=!others.length;
}
for(const id of ['type1','type2','type3','top'])byId(id).addEventListener('change',render);
for(const b of document.querySelectorAll('[data-tab]'))b.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===b.dataset.tab))});
fetch('./data.json').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(d=>{db=d;byId('type1').value='Fogo';byId('type2').value='Elétrico';byId('type3').value='Nenhum';render()}).catch(err=>{byId('counter').textContent='Não foi possível carregar os dados';byId('topCards').append(node('p','',`Erro ao carregar data.json: ${err.message}. Abra pelo GitHub Pages ou use um servidor local, não file://.`))});
