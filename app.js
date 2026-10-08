'use strict';
// DADOS DEMONSTRATIVOS: não representam a migração completa da planilha.
const areas=[
 {name:'Floresta · 3 - Bosque Antigo · Área 3',level:41,pokemon:'Yanma · Beautifly · Beedrill',rates:{Fogo:100,'Elétrico':83}},
 {name:'Floresta · 4 - Raízes Torcidas · Área 2',level:57,pokemon:'Masquerain · Ninjask · Breloom',rates:{Fogo:100,'Elétrico':83}},
 {name:'Floresta · 1 - Orla da Mata · Área 5',level:10,pokemon:'Combee · Hoppip · Spinarak',rates:{Fogo:100,'Elétrico':50}},
 {name:'Floresta · 3 - Bosque Antigo · Área 4',level:41,pokemon:'',rates:{Fogo:100,'Elétrico':33}},
 {name:'Floresta · 3 - Bosque Antigo · Área 7',level:48,pokemon:'',rates:{Fogo:100,'Elétrico':50}},
 {name:'Floresta · 4 - Raízes Torcidas · Área 5',level:63,pokemon:'',rates:{Fogo:100,'Elétrico':33}},
 {name:'Floresta · 1 - Orla da Mata · Área 6',level:13,pokemon:'',rates:{Fogo:100,'Elétrico':33}},
 {name:'Floresta · 3 - Bosque Antigo · Área 2',level:40,pokemon:'',rates:{Fogo:100,'Elétrico':50}},
 {name:'Floresta · 6 - Kalos · Área 3',level:45,pokemon:'',rates:{Fogo:100,'Elétrico':33}},
 {name:'Floresta · 5 - Coração Verde · Área 3',level:69,pokemon:'',rates:{Fogo:100,'Elétrico':17}}
];
const byId=id=>document.getElementById(id);
function selected(){return [...new Set(['type1','type2','type3'].map(id=>byId(id).value).filter(t=>t!=='Nenhum'))]}
function score(a,types){if(!types.length)return 0;return types.reduce((s,t)=>s+(a.rates[t]??0),0)/types.length}
function render(){const types=selected();const top=Math.max(1,Number(byId('top').value)||3);const ranked=areas.map((a,i)=>({...a,score:score(a,types),order:i})).sort((a,b)=>b.score-a.score||a.order-b.order);const topList=ranked.slice(0,top),other=ranked.slice(top);byId('counter').textContent=`${topList.length} áreas`;byId('topCards').replaceChildren(...topList.map((a,i)=>{const el=document.createElement('article');el.className=`area-card ${i===1?'silver':i===2?'bronze':''}`;const medal=document.createElement('div');medal.className='medal';medal.textContent=['🥇 1º LUGAR','🥈 2º LUGAR','🥉 3º LUGAR'][i]||`#${i+1} · ÁREA`;const title=document.createElement('h3');title.textContent=a.name;const stats=document.createElement('div');stats.className='stats';for(const val of [`Lv. ${a.level}`,`Índice demonstrativo ${a.score.toFixed(0)}%`,...types.map(t=>`${t} ${a.rates[t]??'—'}%`)]){const x=document.createElement('span');x.className='stat';x.textContent=val;stats.append(x)}const p=document.createElement('p');p.className='pokemon';p.textContent=a.pokemon?`Pokémon: ${a.pokemon}`:'Dados de Pokémon pendentes de importação';el.append(medal,title,stats,p);return el}));byId('otherCards').replaceChildren(...other.map(a=>{const row=document.createElement('div');row.className='compact';const n=document.createElement('span');n.textContent=`${a.name} · Lv. ${a.level}`;const s=document.createElement('strong');s.textContent=`${a.score.toFixed(0)}%`;row.append(n,s);return row}));document.querySelector('.second').hidden=other.length===0;}
for(const id of ['type1','type2','type3','top'])byId(id).addEventListener('change',render);
for(const button of document.querySelectorAll('[data-tab]'))button.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b===button));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===button.dataset.tab))});render();
