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
class SurveySocket {
    constructor(io) {
        this.io = io;
        this.init();
    }
    init() {
        this.io.on('connection', (socket) => {
            console.log('A new client connected');
            socket.on('userConnected', (data) => {
                socket.broadcast.emit('newUserConnected', `${data.username} has connected`);
            });
            socket.on('newPoll', (data) => {
                console.log('New poll data received:', data);
                this.io.emit('newPoll', data);
            });
            socket.on('deleteSurvey', (surveyId) => {
                console.log(`Deleting survey with ID: ${surveyId}`);
                this.io.emit('surveyDeleted', surveyId);
            });
            socket.on('vote', (surveyId, optionIndex) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const survey = yield survey_model_1.default.findById(surveyId);
                    if (survey) {
                        survey.votes[optionIndex];
                        yield survey.save();
                        this.io.emit('voteUpdated', {
                            surveyId,
                            votes: survey.votes,
                        });
                    }
                }
                catch (error) {
                    console.error("Error al actualizar los votos:", error);
                }
            }));
            socket.on('disconnect', () => {
                console.log('A client disconnected');
            });
        });
    }
}
exports.default = SurveySocket;
