//routes login,register and profile
import { Router } from 'express';
import UserController from '../controllers/user.controller';
import authenticateToken from '../middleware/auth';

const router = Router();
const userController = new UserController();

router.post('/register', userController.register);
router.post('/login', async (req, res) => {
    await userController.login(req, res);
  });
  router.get('/profile',authenticateToken, async (req, res) => {
    await userController.userProfile(req, res);
  });

export default router;