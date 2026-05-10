import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './monggoDb/connect.js';
import dispensesRouter from './router/dispense/DispenseRouter.js';
import postsRouter from './router/post/PostRouter.js';
import getsRouter from './router/get/GetRouter.js';
import assistantRouter from './router/ai/ChatAssistant.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: '10mb',
  })
);

try {
  console.log('Connecting to database...');
  await connectDb();
  console.log('✅ Database connected');
} catch (err) {
  console.error('❌ FULL DATABASE ERROR:', err);
  process.exit(1);
}

app.use('/api', assistantRouter);
app.use('/api', postsRouter);
app.use('/api', getsRouter);
app.use('/api', dispenseRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
