import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Gateway API is running!' });
});

export default router;
