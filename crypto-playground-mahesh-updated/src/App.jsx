import React, { useMemo, useState } from 'react'
import ResultBox from './components/ResultBox.jsx'
import { caesarEncrypt, caesarDecrypt } from './ciphers/caesar.js'
import { vigenereEncrypt, vigenereDecrypt } from './ciphers/vigenere.js'
import { playfairEncrypt, playfairDecrypt, playfairTable } from './ciphers/playfair.js'
import { transpositionEncrypt, transpositionDecrypt } from './ciphers/transposition.js'
import { Lock, Cog, Keyboard, Key as KeyIcon, ClipboardCopy, RotateCcw, Info } from 'lucide-react'

const methods = [
  { id: 'caesar',     label: 'Caesar Cipher',     help: 'Shift each letter by a fixed number (1–25).' },
  { id: 'vigenere',   label: 'Vigenère Cipher',   help: 'Use a repeating keyword to shift letters.' },
  { id: 'playfair',   label: 'Playfair Cipher',   help: 'Encrypt letter pairs using a 5×5 key table (I/J combined).' },
  { id: 'transpose',  label: 'Transposition Cipher', help: 'Columnar transposition using key ordering across columns.' },
]

const ops = [
  { id: 'enc', label: 'Encrypt' },
  { id: 'dec', label: 'Decrypt' },
]

export default function App(){
  const [method, setMethod] = useState('vigenere')
  const [op, setOp] = useState('enc')
  const [text, setText] = useState('my name is mahesh')
  const [key, setKey] = useState('name')
  const [steps, setSteps] = useState([])

  const result = useMemo(()=>{
    const s = []
    try{
      if (method==='caesar'){
        const n = parseInt(key, 10)
        if (isNaN(n) || n<1 || n>25) throw new Error('Caesar: key must be a number between 1 and 25.')
        s.push({title:'Shift', body:`Using shift = ${n}`})
        s.push({title:'Input (as typed)', body: text || ''})
        const out = op==='enc' ? caesarEncrypt(text, n) : caesarDecrypt(text, n)
        s.push({title:'Note', body:'Only letters are shifted; other characters are preserved.'})
        setSteps(s); return out
      }else if(method==='vigenere'){
        const k = (key||'').replace(/[^A-Za-z]/g,'')
        if(!k) throw new Error('Vigenère: key must contain letters.')
        s.push({title:'Sanitized Key', body:k.toUpperCase()})
        s.push({title:'Input (as typed)', body:text||''})
        const out = op==='enc' ? vigenereEncrypt(text, k) : vigenereDecrypt(text, k)
        s.push({title:'Key Stream', body: k.toUpperCase().repeat( Math.ceil((text||'').length / k.length) ).slice(0, (text||'').length)})
        setSteps(s); return out
      }else if(method==='playfair'){
        const k = (key||'').replace(/[^A-Za-z]/g,'')
        if(!k) throw new Error('Playfair: key must contain letters.')
        s.push({title:'Sanitized Key', body:k.toUpperCase().replace(/J/g,'I')})
        const tbl = playfairTable(k)
        s.push({title:'5×5 Table', body: tbl.map(r=>r.join(' ')).join('\n')})
        const out = op==='enc' ? playfairEncrypt(text, k) : playfairDecrypt(text, k)
        s.push({title: op==='enc'?'Pairing':'Unpairing', body:'Message split to digraphs; handles identical letters and odd length.'})
        setSteps(s); return out
      }else{
        const k = (key||'').replace(/[^A-Za-z]/g,'')
        if(!k) throw new Error('Transposition: key must contain letters.')
        s.push({title:'Sanitized Key', body:k.toUpperCase()})
        s.push({title:'Input (letters only)', body:(text||'').toUpperCase().replace(/[^A-Z]/g,'')})
        const out = op==='enc' ? transpositionEncrypt(text, k) : transpositionDecrypt(text, k)
        s.push({title: op==='enc'?'Columnar Read':'Columnar Rebuild', body:'See grid and column order in steps.'})
        setSteps(s); return out
      }
    }catch(e){
      setSteps([{title:'Error', body:e.message}])
      return 'Error: ' + e.message
    }
  }, [method, op, text, key])

  const reset = () => { setText(''); setKey(''); setSteps([]) }
  const showTable = method==='playfair'
  const copyResult = async () => { try{ await navigator.clipboard.writeText(result||'') }catch{} }

  return (
    <div className="min-h-screen gradient-bg text-white">
      <header className="pt-12 pb-4">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
            Cryptography Playground <span className="text-white/70">by</span> <span className="text-brand-500">Mahesh</span>
          </h1>
          <p className="text-white/70 mt-2">Learn, Encrypt, and Decrypt with Classic Ciphers</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        <div className="card p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label inline-flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-400" /> Cipher Method
              </label>
              <select value={method} onChange={e=>setMethod(e.target.value)} className="input mt-1">
                {methods.map(m=>(<option key={m.id} value={m.id}>{m.label}</option>))}
              </select>
              <p className="text-xs text-white/60 mt-2">{methods.find(m=>m.id===method)?.help}</p>
            </div>

            <div>
              <label className="label inline-flex items-center gap-2">
                <Cog className="w-4 h-4 text-brand-400" /> Operation
              </label>
              <select value={op} onChange={e=>setOp(e.target.value)} className="input mt-1">
                {ops.map(o=>(<option key={o.id} value={o.id}>{o.label}</option>))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="label inline-flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-brand-400" /> Text
            </label>
            <textarea value={text} onChange={e=>setText(e.target.value)} rows={4} className="input mt-1 resize-y" placeholder="Type your message here..." />
          </div>

          <div className="mt-4">
            <label className="label inline-flex items-center gap-2">
              <KeyIcon className="w-4 h-4 text-brand-400" /> Key
            </label>
            <input value={key} onChange={e=>setKey(e.target.value)} className="input mt-1" placeholder={ method==='caesar' ? 'Enter a number 1–25' : method==='transpose' ? 'Enter a keyword (letters only)' : 'Enter a keyword' } type={method==='caesar' ? 'number' : 'text'} />
            {method==='caesar' && <p className="text-xs text-white/60 mt-2">Tip: 3 is the classic Caesar shift.</p>}
            {method==='vigenere' && <p className="text-xs text-white/60 mt-2">Letters only. Non-letters are ignored for the key.</p>}
            {method==='playfair' && <p className="text-xs text-white/60 mt-2">I/J are combined. Non-letters are ignored.</p>}
            {method==='transpose' && <p className="text-xs text-white/60 mt-2">Columnar method: the key’s alphabetical order defines column reading order.</p>}
          </div>

          <div className="mt-6 flex gap-3">
            <button className="btn-primary inline-flex items-center gap-2" onClick={()=>{}}><Info className="w-4 h-4" /> Compute</button>
            <button className="btn-muted inline-flex items-center gap-2" onClick={reset}><RotateCcw className="w-4 h-4" /> Reset</button>
            <button className="btn-muted inline-flex items-center gap-2" onClick={copyResult}><ClipboardCopy className="w-4 h-4" /> Copy Result</button>
          </div>

          <ResultBox value={result} />

          <div className="card p-6 mt-6">
            <div className="flex items-center gap-2 mb-3"><Info className="w-4 h-4 text-brand-400" /><h3 className="text-lg font-semibold">How it worked</h3></div>
            {steps?.length ? (
              <ol className="space-y-3 list-decimal list-inside text-sm">
                {steps.map((s, i)=>(
                  <li key={i}><p className="font-medium text-white">{s.title}</p><pre className="mt-1 whitespace-pre-wrap break-words text-white/80 bg-white/5 border border-white/10 rounded-xl p-3">{s.body}</pre></li>
                ))}
              </ol>
            ) : <p className="text-white/60">Choose a method, enter text & key to see step-by-step process here.</p>}
          </div>

          {showTable && (
            <div className="card p-6 mt-6">
              <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Playfair Key Table</h3><span className="badge">{(key||'').toUpperCase() || 'EMPTY KEY'}</span></div>
              <div className="grid grid-cols-5 gap-3 mt-4 w-fit">{playfairTable(key).flat().map((ch,i)=>(<div key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-semibold">{ch}</div>))}</div>
            </div>
          )}
        </div>

        <footer className="text-center text-white/50 mt-10"><p>© {new Date().getFullYear()} By Mahesh Perera</p></footer>
      </main>
    </div>
  )
}