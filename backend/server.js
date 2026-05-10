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
