"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const survey_model_1 = __importDefault(require("../model/survey.model"));
class SurveyController {
    createSurvey(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { question, options, votes } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(400).json({ message: 'Usuario no autenticado' });
                }
                const survey = new survey_model_1.default({
                    question,
                    options,
                    votes: Array(req.body.options.length).fill(0),
                    createdBy: userId,
                });
                yield survey.save();
                const surveyWithUser = yield survey_model_1.default.aggregate([
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
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al crear la encuesta' });
            }
        });
    }
    vote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { surveyId, optionIndex } = req.body;
                const survey = yield survey_model_1.default.findById(surveyId);
                if (!survey) {
                    return res.status(404).json({ message: 'Encuesta no encontrada' });
                }
                if (optionIndex < 0 || optionIndex >= survey.options.length) {
                    return res.status(400).json({ message: 'Índice de opción inválido' });
                }
                survey.votes[optionIndex] += 1; // Incrementar el voto
                yield survey.save();
                return res.status(200).json(survey);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al registrar el voto' });
            }
        });
    }
}
exports.default = new SurveyController();
