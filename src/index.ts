import express from 'express';
import { PrismaClient } from '@prisma/client';
import identifyRouter from './routes/identify';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use('/identify', identifyRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});