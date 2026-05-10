import { Router } from 'express';
import Medicine from '../../monggoDb/model/Medicine.js';

const postsRouter = Router();

// ── CREATE ──────────────────────────────────────────
postsRouter.post('/medicines', async (req, res) => {
  try {
    const { name, category, qty, minStock, unit, expiry, supplier, price } =
      req.body;

    if (!name) {
      return res.status(400).json({ error: 'Medicine name is required.' });
    }

    const medicine = new Medicine({
      name,
      category,
      qty: Number(qty) || 0,
      minStock: Number(minStock) || 0,
      unit,
      expiry: expiry ? new Date(expiry) : null,
      supplier,
      price: Number(price) || 0,
    });

    await medicine.save();

    return res.status(201).json({
      success: true,
      message: 'Medicine added successfully.',
      data: medicine,
    });
  } catch (err) {
    console.error('[POST MEDICINE ERROR]', err);
    return res.status(500).json({ error: 'Failed to add medicine.' });
  }
});

// ── UPDATE ──────────────────────────────────────────
postsRouter.post('/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, qty, minStock, unit, expiry, supplier, price } =
      req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      id,
      {
        name,
        category,
        qty: Number(qty) || 0,
        minStock: Number(minStock) || 0,
        unit,
        expiry: expiry ? new Date(expiry) : null,
        supplier,
        price: Number(price) || 0,
      },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found.' });
    }

    return res.json({
      success: true,
      message: 'Medicine updated successfully.',
      data: medicine,
    });
  } catch (err) {
    console.error('[UPDATE MEDICINE ERROR]', err);
    return res.status(500).json({ error: 'Failed to update medicine.' });
  }
});

// ── DELETE ──────────────────────────────────────────
postsRouter.post('/medicines/:id/delete', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const medicine = await Medicine.findByIdAndDelete(id);

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found.' });
    }

    return res.json({
      success: true,
      message: 'Medicine deleted successfully.',
    });
  } catch (err) {
    console.error('[DELETE MEDICINE ERROR]', err);
    return res.status(500).json({ error: 'Failed to delete medicine.' });
  }
});

postsRouter.delete('/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const medicine = await Medicine.findByIdAndDelete(id);

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found.' });
    }

    return res.json({
      success: true,
      message: 'Medicine deleted successfully.',
    });
  } catch (err) {
    console.error('[DELETE MEDICINE ERROR]', err);
    return res.status(500).json({ error: 'Failed to delete medicine.' });
  }
});

export default postsRouter;
