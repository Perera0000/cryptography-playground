export function mod(n, m){ return ((n % m) + m) % m }
export function caesarTransform(text, shift){
  const A='A'.charCodeAt(0), a='a'.charCodeAt(0)
  return Array.from(text).map(ch=>{
    if(ch>='A' && ch<='Z'){ const x=ch.charCodeAt(0)-A; return String.fromCharCode(A+mod(x+shift,26)) }
    if(ch>='a' && ch<='z'){ const x=ch.charCodeAt(0)-a; return String.fromCharCode(a+mod(x+shift,26)) }
    return ch
  }).join('')
}
export function caesarEncrypt(text, key){ const k = parseInt(key,10) || 0; return caesarTransform(text, k) }
export function caesarDecrypt(text, key){ const k = parseInt(key,10) || 0; return caesarTransform(text, -k) }