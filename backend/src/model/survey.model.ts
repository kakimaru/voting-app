import mongoose, { Schema, Document } from 'mongoose';

interface ISurvey extends Document {
  question: string;
  options: string[];
  creationDate: Date;
}

const surveySchema: Schema = new Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  creationDate: {
    type: Date,
    default: Date.now
  }
});

const Survey = mongoose.model<ISurvey>('Survey', surveySchema);

export default Survey;