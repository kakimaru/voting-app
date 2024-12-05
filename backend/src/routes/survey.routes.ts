import express from 'express';
import { createSurvey } from '../controllers/survey.controller';

const router = express.Router();

router.post('/create', createSurvey);

export default router;