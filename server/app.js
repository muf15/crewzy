import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import routes from './routes/index.js';
import connectDB from './config/db.js';

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite default port
    'http://localhost:5174', // Alternative Vite port
    'http://localhost:3000', // React dev server
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:3000'
  ],
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Use routes from routes folder
app.use('/api/v1', routes);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
