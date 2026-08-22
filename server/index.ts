import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './db';
import { seedDatabase } from './seed';
import apiRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend cross-origin requests
app.use(cors());

// Parse JSON request payloads
app.use(express.json());

// Register API router
app.use('/api', apiRouter);

// Serve static frontend assets in production mode
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Nexora HR REST API server running.');
  });
}

// Start Server
async function startServer() {
  // Connect to Database
  await connectDB();
  
  // Seed Database with initial datasets
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`[Nexora Server] Express running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Nexora Server] Server bootstrap error:', err);
});
