import React from 'react'

export default function ResultBox({ value='—', label='Result' }){
  const copy = async () => {
    try { await navigator.clipboard.writeText(value || '') } catch(e) {}
  }
  return (
    <div className="card p-6 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{label}</h3>
        <button onClick={copy} className="copy-btn">Copy</button>
      </div>
      <div className="whitespace-pre-wrap font-mono text-emerald-300 break-words">{value}</div>
    </div>
  )
}