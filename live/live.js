const el = id => document.getElementById(id);
const teacher = location.hostname === '127.0.0.1';
el(teacher?'staff':'student').hidden=false;
const status = message => {el('status').textContent=message};
let key='', offset=0, timer;
let points=[];
async function post(path,data){
  const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),cache:'no-store'});
  const value=await r.json();
  if(!r.ok)throw Object.assign(new Error(value),{code:r.status});
  return value;
}
function reset(){
  clearTimeout(timer);key='';offset=0;points=[];el('rows').replaceChildren();el('code').textContent='';el('running').hidden=true;el('start').disabled=false;
}
async function pulse(){
  const active=key;
  try{
    const data=await post('/pulse',{key,offset});
    if(key!==active)return;
    for(const point of data.points){
      const tr=document.createElement('tr');
      for(const value of point)tr.insertCell().textContent=value.toLocaleString('de-DE',{maximumSignificantDigits:14});
      el('rows').prepend(tr);
    }
    points.push(...data.points);offset+=data.points.length;el('total').textContent=offset+' Messpunkte';status('Raum geöffnet.');
  }catch(e){if(key!==active)return;status(e.message);if([403,410].includes(e.code)){reset();return}}
  if(key===active)timer=setTimeout(pulse,2000);
}
el('start').onclick=async()=>{
  el('start').disabled=true;
  try{const r=await post('/start',{});key=r.key;el('code').textContent=r.code;el('addresses').textContent=r.addresses.map(a=>'http://'+a).join(' oder ');el('running').hidden=false;el('total').textContent='0 Messpunkte';pulse()}
  catch(e){status(e.message);el('start').disabled=false}
};
el('end').onclick=async()=>{try{await post('/end',{key});reset();status('Raum geschlossen.')}catch(e){status(e.message)}};
addEventListener('pagehide',()=>{if(key){navigator.sendBeacon('/end',new Blob([JSON.stringify({key})],{type:'application/json'}));reset()}});
document.querySelector('form').onsubmit=async e=>{
  e.preventDefault();
  const number=id=>Number(el(id).value.trim().replace(',','.'));
  if(!['x','y'].every(id=>el(id).value.trim() && Number.isFinite(number(id))))return status('Bitte zwei Zahlen eingeben.');
  const button=e.target.querySelector('button');button.disabled=true;
  try{await post('/point',{code:el('room').value.trim().toLowerCase(),group:number('group'),x:number('x'),y:number('y')});status('Messpunkt angekommen.');el('x').value='';el('y').value='';el('x').focus()}catch(err){status(err.message)}finally{button.disabled=false}
};

el('export').onclick=()=>{
  if(!points.length)return status('Zuerst einen Messpunkt sammeln.');
  const groups=new Map();
  for(const [team,x,y] of points){
    if(!groups.has(team))groups.set(team,{name:'Gruppe '+team,visible:true,points:[]});
    groups.get(team).points.push({x,y,s:null,test:false});
  }
  const state={name:'Klassenmessung',x:'x',y:'y',groups:[...groups.values()],active:0,kind:'line',weighted:false};
  const url=URL.createObjectURL(new Blob([JSON.stringify({format:'schmidbauer.studio.1',state})],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='klassenmessung.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  status('Im Auswertungsraum unter „Sitzung verwalten“ die gesicherte Datei öffnen.');
};
