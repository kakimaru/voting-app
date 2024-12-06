import { Request, Response } from 'express';
import Survey from '../model/survey.model'; 
import User from '../model/user.model'; 



class SurveyController {
  
 async createSurvey  (req: Request, res: Response){
  try {
    const { question, options, votes } = req.body;
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(400).json({ message: 'Usuario no autenticado' });
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
      return res.status(404).json({ message: 'Encuesta no encontrada' });
    }

    if (optionIndex < 0 || optionIndex >= survey.options.length) {
      return res.status(400).json({ message: 'Índice de opción inválido' });
    }

    survey.votes[optionIndex] += 1; // Incrementar el voto
    await survey.save();

    return res.status(200).json(survey);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al registrar el voto' });
  }
}

}

export default new SurveyController();
