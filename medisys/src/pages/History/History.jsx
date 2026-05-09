import { useState } from 'react';
import Panel from '../../components/Panel/Panel';
import Button from '../../components/Button/Button';
import { useApp } from '../../context/AppContext';
import { fmtDateFull, exportLogsAsCSV } from '../../utils/helpers';

export default function History({ toast }) {
  const { state } = useApp();
  const { dispenseLogs } = state;

  const [search, setSearch] = useState('');

  const filtered = [...dispenseLogs].reverse().filter((l) => {
    const q = search.toLowerCase();
    return (
      !q ||
      l.medicineName.toLowerCase().includes(q) ||
      (l.to || '').toLowerCase().includes(q) ||
      (l.by || '').toLowerCase().includes(q)
    );
  });

  function handleExport() {
    if (!dispenseLogs.length) {
      toast('No history to export.', 'error');
      return;
    }
    exportLogsAsCSV(dispenseLogs);
    toast('History exported as CSV!', 'success');
  }

  return (
    <div>
      <div className='page-header' style={{ marginBottom: '.5rem' }}>
        <div>
          <div className='page-title'>Dispensing History</div>
          <div className='page-sub' style={{ marginBottom: '.5rem' }}>
            Full audit log of all medicine dispenses
          </div>
        </div>
        <Button variant='secondary' size='sm' onClick={handleExport}>
          ⬇ Export CSV
        </Button>
      </div>

      <Panel>
        <div
          style={{
            padding: '.7rem 1rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <input
            className='search-box'
            placeholder='🔍 Search history...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date &amp; Time</th>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Dispensed To</th>
                <th>By</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {!filtered.length ? (
                <tr>
                  <td colSpan='7' className='empty-state'>
                    No history yet
                  </td>
                </tr>
              ) : (
                filtered.map((l, i) => (
                  <tr key={l._id}>
                    <td
                      style={{
                        color: 'var(--text3)',
                        fontFamily: 'var(--mono)',
                        fontSize: '.75rem',
                      }}
                    >
                      {dispenseLogs.length - i}
                    </td>
                    <td
                      style={{ fontFamily: 'var(--mono)', fontSize: '.75rem' }}
                    >
                      {fmtDateFull(l.date)}
                    </td>
                    <td style={{ fontWeight: 600 }}>{l.medicineName}</td>
                    <td>
                      <span className='pill pill-blue'>{l.qty}</span>
                    </td>
                    <td>{l.to}</td>
                    <td style={{ fontSize: '.78rem', color: 'var(--text3)' }}>
                      {l.by || '—'}
                    </td>
                    <td style={{ fontSize: '.78rem', color: 'var(--text3)' }}>
                      {l.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
