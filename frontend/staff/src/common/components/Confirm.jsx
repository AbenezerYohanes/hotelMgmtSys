import React from 'react'

export default function Confirm({ open, title = 'Confirm', message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 8, width: '90%', maxWidth: 480, padding: 16 }}>
        <h3>{title}</h3>
        <div style={{ margin: '12px 0' }}>{message}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} style={{ background: '#c53030', color: '#fff' }}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
