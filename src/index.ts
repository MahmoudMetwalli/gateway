import express from 'express';
import { PORT } from './config';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Gateway API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
