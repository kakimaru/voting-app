import express from 'express';
import SurveyController from '../controllers/survey.controller';
import authenticateToken from '../middleware/auth';

const router = express.Router();

router.post('/create', authenticateToken, async (req, res) =>{
  await SurveyController.createSurvey(req, res);
});
router.post('/vote', authenticateToken, async (req, res) => {
  await SurveyController.vote(req, res);
});

export default router;