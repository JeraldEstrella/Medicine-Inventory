import { Router } from 'express';
import Medicine from '../../monggoDb/model/Medicine.js';

const getsRouter = Router();

// ── GET ALL MEDICINES ──────────────────────────────
getsRouter.get('/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });

    console.log(medicines);

    return res.json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (err) {
    console.error('[GET MEDICINES ERROR]', err);
    return res.status(500).json({ error: 'Failed to fetch medicines.' });
  }
});

// ── GET SINGLE MEDICINE ────────────────────────────
getsRouter.get('/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found.' });
    }

    return res.json({
      success: true,
      data: medicine,
    });
  } catch (err) {
    console.error('[GET MEDICINE ERROR]', err);
    return res.status(500).json({ error: 'Failed to fetch medicine.' });
  }
});

export default getsRouter;
