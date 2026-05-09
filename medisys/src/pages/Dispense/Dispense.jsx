import { useState } from 'react';
import './Dispense.css';
import Panel from '../../components/Panel/Panel';
import Button from '../../components/Button/Button';
import { useApp } from '../../context/AppContext';
import { useEffect } from 'react';
import { fmtDate, fmtDateFull, todaysLogs } from '../../utils/helpers';

export default function Dispense({ toast }) {
  const { state, dispatch } = useApp();
  const { medicines, dispenseLogs } = state;

  const [medId, setMedId] = useState('');
  const [qty, setQty] = useState('');
  const [to, setTo] = useState('');
  const [by, setBy] = useState('');
  const [notes, setNotes] = useState('');

  const selected = medicines.find((m) => m._id === medId);
  const todayLog = todaysLogs(dispenseLogs);

  useEffect(() => {
    async function fetchDispenses() {
      try {
        const response = await fetch('http://localhost:3000/api/dispense');
        const data = await response.json();

        if (data.success && data.data) {
          dispatch({
            type: 'SET_DISPENSE_LOGS',
            payload: data.data,
          });
        }
      } catch (err) {
        console.error('Failed to fetch dispenses:', err);
      }
    }

    fetchDispenses();
  }, [dispatch]);

  async function handleSubmit() {
    if (!medId) {
      toast('Please select a medicine.', 'error');
      return;
    }
    if (!qty || Number(qty) < 1) {
      toast('Enter a valid quantity.', 'error');
      return;
    }
    if (!to.trim()) {
      toast('Please enter who it is dispensed to.', 'error');
      return;
    }
    if (Number(qty) > selected.qty) {
      toast('Quantity exceeds current stock!', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/dispense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineId: medId,
          qty: Number(qty),
          to,
          by,
          notes,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update context
        dispatch({
          type: 'DISPENSE',
          payload: { medicineId: medId, qty: Number(qty), to, by, notes },
        });
        toast(
          `✅ Dispensed ${qty} ${selected.unit} of ${selected.name}`,
          'success'
        );
        setMedId('');
        setQty('');
        setTo('');
        setBy('');
        setNotes('');
      } else {
        toast(result.error, 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Failed to record dispense.', 'error');
    }
  }

  return (
    <div>
      <div className='dispense-header'>
        <div>
          <div className='dispense-title'>Dispense Medicine</div>
          <div className='dispense-sub'>
            Record outgoing medicines to patients
          </div>
        </div>
      </div>

      <div className='dispense-layout'>
        {/* Form */}
        <Panel title='📋 Dispensing Form'>
          <div className='form-group' style={{ marginBottom: '.9rem' }}>
            <label className='form-label'>Select Medicine *</label>
            <select
              className='form-input'
              value={medId}
              onChange={(e) => setMedId(e.target.value)}
            >
              <option value=''>-- Select Medicine --</option>
              {medicines.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} (stock: {m.qty})
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className='disp-stock-info'>
              <div>
                <div className='text-sm'>Current Stock</div>
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                  }}
                >
                  {selected.qty} {selected.unit}
                </div>
              </div>
              <div>
                <div className='text-sm'>Min. Stock</div>
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text3)',
                  }}
                >
                  {selected.minStock}
                </div>
              </div>
              <div>
                <div className='text-sm'>Expiry</div>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color:
                      selected.expiry && new Date(selected.expiry) <= new Date()
                        ? 'var(--red)'
                        : 'var(--text)',
                  }}
                >
                  {fmtDate(selected.expiry)}
                </div>
              </div>
            </div>
          )}

          <div className='form-group' style={{ marginBottom: '.9rem' }}>
            <label className='form-label'>Quantity to Dispense *</label>
            <input
              className='form-input'
              type='number'
              value={qty}
              min='1'
              placeholder='e.g. 10'
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          <div className='form-group' style={{ marginBottom: '.9rem' }}>
            <label className='form-label'>
              Dispensed To (Patient / Ward) *
            </label>
            <input
              className='form-input'
              type='text'
              value={to}
              placeholder='e.g. Juan Dela Cruz / OPD Ward'
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className='form-group' style={{ marginBottom: '.9rem' }}>
            <label className='form-label'>Dispensed By (Pharmacist)</label>
            <input
              className='form-input'
              type='text'
              value={by}
              placeholder='e.g. Pharmacist Santos'
              onChange={(e) => setBy(e.target.value)}
            />
          </div>

          <div className='form-group' style={{ marginBottom: '1.2rem' }}>
            <label className='form-label'>Notes</label>
            <input
              className='form-input'
              type='text'
              value={notes}
              placeholder='Optional notes...'
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button
            variant='primary'
            style={{ width: '100%' }}
            onClick={handleSubmit}
          >
            💉 Record Dispense
          </Button>
        </Panel>

        {/* Today's log */}
        <Panel title="⚡ Today's Dispenses">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Qty</th>
                  <th>Dispensed To</th>
                  <th>By</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {!todayLog.length ? (
                  <tr>
                    <td colSpan='5' className='empty-state'>
                      No dispenses today
                    </td>
                  </tr>
                ) : (
                  [...todayLog].reverse().map((l) => (
                    <tr key={l._id}>
                      <td style={{ fontWeight: 600 }}>{l.medicineName}</td>
                      <td>
                        <span className='pill pill-blue'>{l.qty}</span>
                      </td>
                      <td>{l.to}</td>
                      <td>{l.by || '—'}</td>
                      <td
                        style={{
                          fontSize: '.75rem',
                          color: 'var(--text3)',
                          fontFamily: 'var(--mono)',
                        }}
                      >
                        {fmtDateFull(l.date)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
