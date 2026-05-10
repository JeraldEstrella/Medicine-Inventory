import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './monggoDb/connect.js';
import aiRouter from './router/ai/chatAssistant.js';
import dispensesRouter from './router/dispense/Dispense.js';
import postsRouter from './router/post/Posts.js';
import getsRouter from './router/get/Get.js';

dotenv.config();

const app = express();

// CORS must be FIRST, before any routes
app.use(cors());

app.use(
  express.json({
    limit: '10mb',
  })
);

try {
  console.log('Connecting to database...');
  await connectDB();
  console.log('✅ Database connected');
} catch (err) {
  console.error('❌ FULL DATABASE ERROR:', err);
  process.exit(1);
}

app.use('/api', aiRouter);
app.use('/api', postsRouter);
app.use('/api', getsRouter);
app.use('/api', dispensesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
