// Start on the teacher computer: node live/server.mjs
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {networkInterfaces} from 'node:os';
import {randomBytes} from 'node:crypto';
import {performance} from 'node:perf_hooks';

const port = Number(process.env.PORT || 8080);
const local = '127.0.0.1:' + port;
const addresses = Object.values(networkInterfaces()).flat().filter(i => i.family === 'IPv4' && !i.internal).map(i => i.address + ':' + port);
const hosts = new Set([local, ...addresses]);
const lease = 30000;
let room;
function expire() {
  if (room && (performance.now() >= room.until || Date.now() >= room.wallUntil)) room = undefined;
}
setInterval(expire, 1000).unref();
const assets = new Map();
for (const file of ['index.html','live.js']) assets.set('/' + file, await readFile(new URL(file, import.meta.url)));
const workshop = await readFile(new URL('../index.html', import.meta.url));
const limits = new Map();
function allow(ip) {
  const now = performance.now();
  let window = limits.get(ip);
  if (!window || now >= window.end) {
    if (!window && limits.size >= 1024) return false;
    limits.set(ip, window = {end:now + 10000, count:0});
  }
  return ++window.count <= 60;
}
setInterval(() => {for (const [ip,v] of limits) if (performance.now() >= v.end) limits.delete(ip)},10000).unref();
const server = http.createServer(async (req,res) => {
  const host = req.headers.host;
  const teacher = host === local && req.socket.remoteAddress === '127.0.0.1';
  const reply = (code,data) => {res.writeHead(code, {'Content-Type':'application/json'});res.end(JSON.stringify(data))};
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('X-Frame-Options','DENY');
  if (!hosts.has(host)) return reply(403,'Adresse nicht freigegeben.');
  if (req.method === 'GET') {
    if (req.url === '/werkstatt' && teacher) {
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(workshop);
    }
    const path = req.url === '/' ? '/index.html' : req.url;
    if (!assets.has(path)) return reply(404,'Seite fehlt.');
    res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
    res.writeHead(200,{'Content-Type':path.endsWith('.js')?'text/javascript':'text/html; charset=utf-8'});return res.end(assets.get(path));
  }
  if(req.method !== 'POST' || req.headers.origin !== 'http://' + host || req.headers['content-type']?.split(';')[0] !== 'application/json') return reply(403,'Anfrage abgelehnt.');
  if(!allow(req.socket.remoteAddress)) return reply(429,'Bitte kurz warten.');
  try {
    let size=0; const parts=[];
    for await(const chunk of req) {
      size += chunk.length;
      if(size>2048) return reply(413,'Eingabe zu groß.');
      parts.push(chunk);
    }
    const d=JSON.parse(Buffer.concat(parts).toString('utf8'));
    if(!d || typeof d !== 'object' || Array.isArray(d)) return reply(400,'Eingabe prüfen.');
    expire();
    if(req.url==='/start' && teacher){
      if(room) return reply(409,'Es läuft bereits eine Sitzung. Nach einem Abbruch bitte 30 Sekunden warten.');
      room={key:randomBytes(32).toString('hex'),code:randomBytes(5).toString('hex'),until:performance.now()+lease,wallUntil:Date.now()+lease,points:[]};
      return reply(200,{key:room.key,code:room.code,addresses});
    }
    if(!room) return reply(410,'Raum geschlossen.');
    if(req.url==='/point'){
      if(d.code!==room.code) return reply(403,'Raumcode prüfen.');
      if(!Number.isInteger(d.group)||d.group<1||d.group>40||![d.x,d.y].every(v=>Number.isFinite(v)&&Math.abs(v)<=1e12)) return reply(400,'Gruppe oder Messwerte ungültig.');
      if(room.points.length>=4000 || room.points.filter(row=>row[0]===d.group).length>=500) return reply(409,'Raum ist voll.');
      room.points.push([d.group,d.x,d.y]);return reply(200,true);
    }
    if(!teacher || d.key!==room.key) return reply(403,'Nur für die Lehrkraft.');
    if(req.url==='/end'){room=undefined;return reply(200,true)}
    if(req.url==='/pulse'){
      room.until=performance.now()+lease;room.wallUntil=Date.now()+lease;
      const offset=Number.isSafeInteger(d.offset)&&d.offset>=0 ? d.offset:0;
      return reply(200,{points:room.points.slice(offset)});
    }
    return reply(404,'Unbekannte Aktion.');
  } catch {return reply(400,'Eingabe prüfen.')}
});
server.requestTimeout=10000;
server.headersTimeout=10000;
server.listen(port,'0.0.0.0',()=>console.log('Lehrkraft: http://'+local+'  |  Klasse: '+addresses.map(a=>'http://'+a).join(', ')));
