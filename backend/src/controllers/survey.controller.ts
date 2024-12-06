import { Request, Response } from 'express';
import Survey from '../model/survey.model'; 
import User from '../model/user.model'; 



class SurveyController {
  
  async createSurvey  (req: Request, res: Response){
    try {
      const { question, options, votes } = req.body;
      const userId = req.user?.id; 
  
      if (!userId) {
        return res.status(400).json({ message: 'User not authenticated' });
      }
  
      const survey = new Survey({
        question,
        options,
        votes:Array(req.body.options.length).fill(0),
        createdBy: userId,
      });
  
      await survey.save();
  
      const surveyWithUser = await Survey.aggregate([
        {
          $match: { _id: survey._id }, 
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'user', 
          },
        },
        {
          $unwind: '$user', 
        },
        {
          $project: {
            question: 1,
            options: 1,
            createdBy: 1,
            'user.username': 1,
            'user.email': 1, 
          },
        },
      ]);
  
      if (!surveyWithUser || surveyWithUser.length === 0) {
        return res.status(404).json({ message: 'Encuesta no encontrada' });
      }
  
      return res.status(201).json(surveyWithUser[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al crear la encuesta' });
    }
  }

async vote(req: Request, res: Response) {
  try {
    const { surveyId, optionIndex } = req.body;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (optionIndex < 0 || optionIndex >= survey.options.length) {
      return res.status(400).json({ message: 'Option index is out of bounds' });
    }

    survey.votes[optionIndex] += 1; 
    await survey.save();

    return res.status(200).json(survey);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering vote' });
  }
}

async getSurveys(req: Request, res: Response) {
  try {
    const surveys = await Survey.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          question: 1,
          options: 1,
          votes: 1,
          'user.username': 1,
        },
      },
    ]);

    if (!surveys || surveys.length === 0) {
      return res.status(404).json({ message: 'No surveys found' });
    }

    return res.status(200).json(surveys);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching surveys' });
  }
}


async deleteSurvey(req: Request, res: Response) {
  try {
    const { surveyId } = req.params;
    const survey = await Survey.findByIdAndDelete(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    return res.status(200).json({ message: 'Survey deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar la encuesta' });
  }
}

}

export default new SurveyController();
