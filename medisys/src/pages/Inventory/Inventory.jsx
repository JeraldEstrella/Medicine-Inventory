import { useState } from 'react';
import './Inventory.css';
import Panel from '../../components/Panel/Panel';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { useApp } from '../../context/AppContext';
import {
  fmtDate,
  daysUntilExpiry,
  stockBarPct,
  stockBarColor,
} from '../../utils/helpers';

const CATEGORIES = [
  'Antibiotics',
  'Vaccines',
  'Maintenance',
  'Analgesics',
  'Vitamins',
  'Others',
];
const UNITS = ['tabs', 'caps', 'vials', 'sachets', 'bottles', 'ampules', 'pcs'];

const BLANK = {
  name: '',
  category: 'Others',
  qty: '',
  minStock: '',
  unit: 'tabs',
  expiry: '',
  supplier: '',
  price: '',
};

function StockPill({ qty, minStock }) {
  if (qty === 0) return <span className='pill pill-red'>Out of Stock</span>;
  if (qty < minStock)
    return <span className='pill pill-yellow'>Low Stock</span>;
  return <span className='pill pill-green'>Adequate</span>;
}

export default function Inventory({ toast }) {
  const { state, dispatch } = useApp();
  const { medicines } = state;

  const [search, setSearch] = useState('');
  const [catFilter, setCat] = useState('');
  const [stockFilter, setStock] = useState('');
  const [modal, setModal] = useState(null); // ← ADD THIS LINE
  const [form, setForm] = useState(BLANK);

  // ── filter ──────────────────────────────────────────────────────────────
  const today = new Date();
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);

  const filtered = medicines.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      (m.supplier || '').toLowerCase().includes(q);
    const matchCat = !catFilter || m.category === catFilter;
    const matchStock =
      !stockFilter ||
      (stockFilter === 'low' && m.qty < m.minStock) ||
      (stockFilter === 'expiring' && m.expiry && new Date(m.expiry) <= in30) ||
      (stockFilter === 'ok' && m.qty >= m.minStock);
    return matchSearch && matchCat && matchStock;
  });

  // ── modal helpers ────────────────────────────────────────────────────────
  function openAdd() {
    setForm(BLANK);
    setModal({ mode: 'add' });
  }

  function openEdit(m) {
    setForm({
      ...m,
      qty: String(m.qty),
      minStock: String(m.minStock),
      price: String(m.price || ''),
    });
    setModal({ mode: 'edit', id: m._id }); // ← Change m.id to m._id
  }

  function closeModal() {
    setModal(null);
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast('Medicine name is required.', 'error');
      return;
    }

    const payload = {
      name: form.name,
      category: form.category,
      qty: Number(form.qty) || 0,
      minStock: Number(form.minStock) || 0,
      unit: form.unit,
      expiry: form.expiry || null,
      supplier: form.supplier,
      price: Number(form.price) || 0,
    };

    try {
      let response;
      if (modal.mode === 'add') {
        response = await fetch('http://localhost:3000/api/medicines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(
          `http://localhost:3000/api/medicines/${modal.id}`, // Uses the _id stored in modal
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
      }

      const result = await response.json();

      if (result.success) {
        dispatch({
          type: modal.mode === 'add' ? 'ADD_MEDICINE' : 'UPDATE_MEDICINE',
          payload: result.data,
        });
        toast(result.message, 'success');
      } else {
        toast(result.error, 'error');
      }

      closeModal();
    } catch (err) {
      console.error(err);
      toast('Failed to save medicine.', 'error');
    }
  }

  async function handleDelete(id) {
    console.log(id);
    if (!window.confirm('Delete this medicine?')) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/medicines/${id}/delete`,
        {
          method: 'POST',
        }
      );

      const result = await response.json();

      if (result.success) {
        dispatch({ type: 'DELETE_MEDICINE', payload: id });
        toast(result.message, 'info');
      } else {
        toast(result.error, 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Failed to delete medicine.', 'error');
    }
  }

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div>
      <div className='inventory-header'>
        <div className='inventory-content'>
          <div className='inventory-title'>Medicine Inventory</div>
          <div className='inventory-sub'>
            Manage stock levels, expiry dates, and supplier information
          </div>
        </div>
        <div className='btn-container'>
          <Button variant='primary' onClick={openAdd}>
            ＋ Add Medicine
          </Button>
        </div>
      </div>

      <Panel>
        {/* Toolbar */}
        <div className='inv-toolbar'>
          <input
            className='search-box'
            placeholder='🔍 Search by name, category, supplier...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className='filter-select'
            value={catFilter}
            onChange={(e) => setCat(e.target.value)}
          >
            <option value=''>All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className='filter-select'
            value={stockFilter}
            onChange={(e) => setStock(e.target.value)}
          >
            <option value=''>All Stock</option>
            <option value='low'>Low Stock</option>
            <option value='expiring'>Expiring Soon</option>
            <option value='ok'>Adequate</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Category</th>
                <th>Stock / Min</th>
                <th>Unit</th>
                <th>Expiry Date</th>
                <th>Supplier</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!filtered.length ? (
                <tr>
                  <td colSpan='9' className='empty-state'>
                    No medicines found.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const days = daysUntilExpiry(m.expiry);
                  const pct = stockBarPct(m.qty, m.minStock);
                  const col = stockBarColor(m.qty, m.minStock);
                  return (
                    <tr key={m._id}>
                      <td className='td-name'>{m.name}</td>
                      <td className='td-category'>{m.category}</td>
                      <td>
                        {m.qty} / {m.minStock}
                        <div className='stock-bar'>
                          <div
                            className='stock-bar-fill'
                            style={{ width: `${pct}%`, background: col }}
                          />
                        </div>
                      </td>
                      <td>{m.unit}</td>
                      <td
                        className={
                          days !== null && days <= 30
                            ? 'expiry-warn'
                            : 'expiry-ok'
                        }
                      >
                        {fmtDate(m.expiry)}
                      </td>
                      <td>{m.supplier || '—'}</td>
                      <td>₱{Number(m.price || 0).toFixed(2)}</td>
                      <td>
                        <StockPill qty={m.qty} minStock={m.minStock} />
                      </td>
                      <td>
                        <div className='actions'>
                          <Button
                            variant='secondary'
                            size='sm'
                            onClick={() => openEdit(m)}
                          >
                            ✏️
                          </Button>
                          <Button
                            variant='danger'
                            size='sm'
                            onClick={() => handleDelete(m._id)}
                          >
                            🗑
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Add/Edit Modal */}
      <Modal
        open={!!modal}
        onClose={closeModal}
        title={modal?.mode === 'add' ? '➕ Add Medicine' : '✏️ Edit Medicine'}
        footer={
          <>
            <Button variant='secondary' onClick={closeModal}>
              Cancel
            </Button>
            <Button variant='primary' onClick={handleSave}>
              {modal?.mode === 'add' ? 'Add Medicine' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <div className='form-grid'>
          <div className='form-group full'>
            <label className='form-label'>Medicine Name *</label>
            <input
              className='form-input'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder='e.g. Amoxicillin 500mg'
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Category</label>
            <select
              className='form-input'
              name='category'
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label className='form-label'>Unit</label>
            <select
              className='form-input'
              name='unit'
              value={form.unit}
              onChange={handleChange}
            >
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label className='form-label'>Current Quantity *</label>
            <input
              className='form-input'
              type='number'
              name='qty'
              value={form.qty}
              onChange={handleChange}
              min='0'
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Minimum Stock</label>
            <input
              className='form-input'
              type='number'
              name='minStock'
              value={form.minStock}
              onChange={handleChange}
              min='0'
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Expiry Date</label>
            <input
              className='form-input'
              type='date'
              name='expiry'
              value={form.expiry}
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Unit Price (₱)</label>
            <input
              className='form-input'
              type='number'
              name='price'
              value={form.price}
              onChange={handleChange}
              step='0.01'
              min='0'
            />
          </div>
          <div className='form-group full'>
            <label className='form-label'>Supplier</label>
            <input
              className='form-input'
              name='supplier'
              value={form.supplier}
              onChange={handleChange}
              placeholder='e.g. DOH Pharma'
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
