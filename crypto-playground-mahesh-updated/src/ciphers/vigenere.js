import { mod } from './caesar'
function normalizeKey(key){ return (key||'').replace(/[^a-z]/gi,'').toUpperCase() }
function shiftsFromKey(key){ const k = normalizeKey(key); return Array.from(k).map(ch=>ch.charCodeAt(0)-65) }
export function vigenereEncrypt(plaintext, key){
  const shifts = shiftsFromKey(key); if(shifts.length===0) return plaintext
  let j=0; return Array.from(plaintext).map(ch=>{
    const code=ch.charCodeAt(0)
    if(ch>='A'&&ch<='Z'){ const p=code-65; const c=mod(p+shifts[j%shifts.length],26); j++; return String.fromCharCode(65+c) }
    if(ch>='a'&&ch<='z'){ const p=code-97; const c=mod(p+shifts[j%shifts.length],26); j++; return String.fromCharCode(97+c) }
    return ch
  }).join('')
}
export function vigenereDecrypt(ciphertext, key){
  const shifts=shiftsFromKey(key); if(shifts.length===0) return ciphertext
  let j=0; return Array.from(ciphertext).map(ch=>{
    const code=ch.charCodeAt(0)
    if(ch>='A'&&ch<='Z'){ const c=code-65; const p=mod(c-shifts[j%shifts.length],26); j++; return String.fromCharCode(65+p) }
    if(ch>='a'&&ch<='z'){ const c=code-97; const p=mod(c-shifts[j%shifts.length],26); j++; return String.fromCharCode(97+p) }
    return ch
  }).join('')
}