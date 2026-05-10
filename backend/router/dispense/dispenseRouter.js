import { Router } from 'express';
import Medicine from '../../mongodb/model/Medicine.js';
import Dispense from '../../mongodb/model/Dispense.js';

const dispenseRouter = Router();

// ── CREATE DISPENSE ────────────────────────────────
dispenseRouter.post('/dispense', async (req, res) => {
  try {
    const { medicineId, qty, to, by, notes } = req.body;

    // Get medicine details
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found.' });
    }

    // Check stock
    if (qty > medicine.qty) {
      return res.status(400).json({ error: 'Insufficient stock.' });
    }

    // Create dispense record
    const dispense = new Dispense({
      medicineId,
      medicineName: medicine.name,
      qty,
      to,
      by,
      notes,
    });

    await dispense.save();

    // Update medicine quantity
    medicine.qty -= qty;
    await medicine.save();

    return res.status(201).json({
      success: true,
      message: 'Dispense recorded successfully.',
      data: dispense,
    });
  } catch (err) {
    console.error('[DISPENSE ERROR]', err);
    return res.status(500).json({ error: 'Failed to record dispense.' });
  }
});

// ── GET ALL DISPENSES ──────────────────────────────
dispenseRouter.get('/dispense', async (req, res) => {
  try {
    const dispenses = await Dispense.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: dispenses.length,
      data: dispenses,
    });
  } catch (err) {
    console.error('[GET DISPENSE ERROR]', err);
    return res.status(500).json({ error: 'Failed to fetch dispenses.' });
  }
});

export default dispenseRouter;
