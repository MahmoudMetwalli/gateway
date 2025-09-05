import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Tenant API is running!' });
});

export default router;
