import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g. 'A', 'B'
  text: { type: String, required: true },
});

const questionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      enum: ["Physics", "Chemistry", "Biology"],
      required: true,
    },
    topic: { type: String, required: true },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    type: {
      type: String,
      enum: ["mcq", "tf", "short"],
      default: "mcq",
    },
    stem: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    choices: [choiceSchema], // for MCQs
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: { type: String },
    tags: [{ type: String }],
    createdBy: {
      type: String,
      default: "system", // 'system' or 'community'
    },
    approved: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
