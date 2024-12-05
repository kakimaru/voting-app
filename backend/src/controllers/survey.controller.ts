import { Request, Response } from 'express';
import Survey from '../model/survey.model';

export const createSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, options } = req.body;

    const newSurvey = new Survey({
      question,
      options
    });
    await newSurvey.save();
    res.json({
      message: 'Survey created successfully',
      question: newSurvey.question,
      options: newSurvey.options
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    res.json({ message: 'Error creating the survey' });
  }
};