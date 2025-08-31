import { mod } from './caesar'
function buildTable(key){
  const seen=new Set(); const letters=[]
  const normalized=(key||'').toUpperCase().replace(/[^A-Z]/g,'').replace(/J/g,'I')
  for(const ch of normalized){ if(!seen.has(ch)){ seen.add(ch); letters.push(ch) } }
  for(let i=0;i<26;i++){ const ch=String.fromCharCode(65+i); if(ch==='J') continue; if(!seen.has(ch)){ seen.add(ch); letters.push(ch) } }
  const table=[]; for(let r=0;r<5;r++){ table.push(letters.slice(r*5,(r+1)*5)) }
  const pos=new Map(); for(let r=0;r<5;r++){ for(let c=0;c<5;c++){ pos.set(table[r][c],[r,c]) } }
  return {table,pos}
}
function digraphsFromText(text, forEncrypt=true){
  const letters=text.toUpperCase().replace(/[^A-Z]/g,'').replace(/J/g,'I'); const result=[]
  for(let i=0;i<letters.length;){
    const a=letters[i]; let b
    if(i+1<letters.length){ b=letters[i+1]; if(a===b){ b='X'; i+=1 } else { i+=2 } } else { b='X'; i+=1 }
    result.push([a,b])
  }
  return result
}
function encodePair(a,b, table, pos, dir){
  const [ra,ca]=pos.get(a); const [rb,cb]=pos.get(b)
  if(ra===rb){ return [ table[ra][mod(ca+dir,5)], table[rb][mod(cb+dir,5)] ] }
  if(ca===cb){ return [ table[mod(ra+dir,5)][ca], table[mod(rb+dir,5)][cb] ] }
  return [table[ra][cb], table[rb][ca]]
}
export function playfairEncrypt(plaintext, key){
  const {table,pos}=buildTable(key); const pairs=digraphsFromText(plaintext, true); const out=[]
  for(const [a,b] of pairs){ const [x,y]=encodePair(a,b,table,pos,+1); out.push(x,y) } return out.join('')
}
export function playfairDecrypt(ciphertext, key){
  const {table,pos}=buildTable(key); const letters=ciphertext.toUpperCase().replace(/[^A-Z]/g,'').replace(/J/g,'I'); const out=[]
  for(let i=0;i<letters.length;i+=2){ const a=letters[i], b=letters[i+1]||'X'; const [x,y]=encodePair(a,b,table,pos,-1); out.push(x,y) } return out.join('')
}
export function playfairTable(key){ return buildTable(key).table }