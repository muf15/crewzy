import express from 'express';

const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'Crewzy API is running' });
});

export default router;
