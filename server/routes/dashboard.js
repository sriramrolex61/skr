import { Router } from 'express';
import protect from '../middleware/auth.js';
import { getDashboard } from '../controllers/dashboardController.js';

const router = Router();

router.get('/', protect, async (req, res, next) => {
  try {
    await getDashboard(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
