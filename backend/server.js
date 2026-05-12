import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './mongodb/connect.js';
import dispensesRouter from './router/dispense/dispenseRouter.js';
import postsRouter from './router/post/postRouter.js';
import getsRouter from './router/get/getRouter.js';
import assistantRouter from './router/ai/chatAssistant.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://medicine-inventory-owcg13gg0-jek-s-projects.vercel.app',
    ],
  })
);

app.use(express.json({ limit: '10mb' }));

// Wrap async code in IIFE or move to separate function
(async () => {
  try {
    console.log('Connecting to database...');
    await connectDb();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ FULL DATABASE ERROR:', err);
    process.exit(1);
  }
})();

app.use('/api', assistantRouter);
app.use('/api', postsRouter);
app.use('/api', getsRouter);
app.use('/api', dispensesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
