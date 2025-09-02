import Question from "../models/Question.js";
import QuizSession from "../models/QuizSession.js";

/**
 * Generate a quiz for a student
 */
export async function generateQuiz(userId, subject, count = 10, difficultyTarget = 3) {
    // Find available questions
    const pool = await Question.find({
        subject,
        difficulty: { $gte: Math.max(1, difficultyTarget - 1), $lte: Math.min(5, difficultyTarget + 1) },
        approved: true,
    }).limit(200); // avoid fetching entire collection

    if (!pool.length) throw new Error("No questions available for this subject");

    // Randomly sample `count` questions
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    // Create a QuizSession record
    const quizSession = await QuizSession.create({
        userId,
        questions: selected.map((q) => ({ questionId: q._id })),
        score: 0,
        duration: 0,
    });

    // Return quizSession with only question info (hide correct answers)
    const sanitizedQuestions = selected.map((q) => ({
        _id: q._id,
        subject: q.subject,
        topic: q.topic,
        type: q.type,
        stem: q.stem,
        choices: q.choices,
        difficulty: q.difficulty,
    }));

    return { quizSessionId: quizSession._id, questions: sanitizedQuestions };
}

/**
 * Submit answers for a quiz
 */
export async function submitQuiz(quizSessionId, answers) {
    const quizSession = await QuizSession.findById(quizSessionId).populate("questions.questionId");

    if (!quizSession) throw new Error("Quiz session not found");

    let score = 0;
    let duration = 0;

    quizSession.questions.forEach((q, index) => {
        const submitted = answers.find((a) => String(a.questionId) === String(q.questionId._id));
        if (submitted) {
            q.chosenAnswer = submitted.answer;
            q.timeTaken = submitted.timeTaken || 0;
            q.correct = submitted.answer === q.questionId.correctAnswer;

            if (q.correct) {
                score += q.questionId.difficulty * 100; // base score by difficulty
                score += Math.max(0, Math.floor((30 - q.timeTaken) * 5)); // bonus for speed
            }

            duration += q.timeTaken;
        }
    });

    quizSession.score = score;
    quizSession.duration = duration;
    await quizSession.save();

    return { score, duration, questions: quizSession.questions };
}