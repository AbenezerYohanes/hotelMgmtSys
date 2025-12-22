import React from 'react'

export default function Table({ columns = [], data = [] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map(c => <th key={c.key} style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>{c.title}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map(c => <td key={c.key} style={{ padding: 8, borderBottom: '1px solid #f2f2f2' }}>{c.render ? c.render(row) : row[c.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
