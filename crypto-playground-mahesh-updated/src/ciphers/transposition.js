// Columnar transposition helper functions (letters only; I/J combined not required here)
export function sanitizeLetters(s){ return (s||'').toUpperCase().replace(/[^A-Z]/g,'') }
export function orderFromKey(key){
  const arr = key.toUpperCase().split('').map((ch,i)=>({ch,i}))
  arr.sort((a,b)=> a.ch===b.ch ? a.i-b.i : (a.ch<b.ch?-1:1))
  const pos = Array(arr.length)
  arr.forEach((it,rank)=> pos[it.i]=rank)
  return pos
}
export function transpositionEncrypt(rawText, rawKey){
  const key = sanitizeLetters(rawKey); if(!key) throw new Error('Transposition: key required.')
  const order = orderFromKey(key); const text = sanitizeLetters(rawText); if(!text) return ''
  const cols = key.length; const rows = Math.ceil(text.length/cols)
  const grid = Array.from({length:rows}, ()=>Array(cols).fill('X'))
  let k=0; for(let r=0;r<rows;r++){ for(let c=0;c<cols;c++){ if(k<text.length) grid[r][c]=text[k++] } }
  let cipher=''; for(let rank=0; rank<cols; rank++){ const colIndex = order.indexOf(rank); for(let r=0;r<rows;r++) cipher += grid[r][colIndex] }
  return cipher
}
export function transpositionDecrypt(rawText, rawKey){
  const key = sanitizeLetters(rawKey); if(!key) throw new Error('Transposition: key required.')
  const order = orderFromKey(key); const cipher = sanitizeLetters(rawText); if(!cipher) return ''
  const cols = key.length; const rows = Math.ceil(cipher.length/cols)
  const grid = Array.from({length:rows}, ()=>Array(cols).fill(''))
  const total = cipher.length; const shortInLastRow = (rows*cols)-total
  const colLens = Array(cols).fill(rows)
  for(let i=cols-shortInLastRow;i<cols;i++) if(i>=0) colLens[i]=rows-1
  let ptr=0; for(let rank=0; rank<cols; rank++){ const cIndex = order.indexOf(rank); const len = colLens[cIndex]; const slice = cipher.slice(ptr, ptr+len); ptr+=len; for(let r=0;r<len;r++) grid[r][cIndex]=slice[r] }
  let plain=''; for(let r=0;r<rows;r++){ for(let c=0;c<cols;c++){ if(grid[r][c]) plain += grid[r][c] } } return plain
}