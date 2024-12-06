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

router.get('/', authenticateToken, async (req, res) => {
  await SurveyController.getSurveys(req, res);
});

router.delete('/:surveyId', authenticateToken, async (req, res) => {
  await SurveyController.deleteSurvey(req, res);
});

export default router;