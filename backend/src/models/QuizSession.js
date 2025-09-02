import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    chosenAnswer: { type: String },
    correct: { type: Boolean, default: false },
    timeTaken: { type: Number, default: 0 }, // in seconds
});

const quizSessionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        questions: [answerSchema],
        score: { type: Number, default: 0 },
        duration: { type: Number, default: 0 }, // total time
    },
    { timestamps: true }
);

const QuizSession = mongoose.model("QuizSession", quizSessionSchema);

export default QuizSession;