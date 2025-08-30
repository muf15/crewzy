import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import routes from './routes/index.js';
import connectDB from './config/db.js';

const app = express();
app.use(express.json());

// Use routes from routes folder
app.use('/api/v1', routes);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
