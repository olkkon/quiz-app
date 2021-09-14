import { executeQuery } from "../database/database.js";

const addAnswerOption = async (questionId, optionText, isCorrect) => {
  await executeQuery(
    "INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES ($1, $2, $3)",
    questionId,
    optionText,
    isCorrect,
  );
};

const addQuestionAnswer = async (
  userId,
  questionId,
  answerOptionId,
  correct,
) => {
  await executeQuery(
    `INSERT INTO question_answers (user_id, question_id, question_answer_option_id, correct)
                                                      VALUES ($1, $2, $3, $4)`,
    userId,
    questionId,
    answerOptionId,
    correct,
  );
};

const deleteAnswerOption = async (answerOptionId, questionId) => {
  await executeQuery(
    "DELETE FROM question_answer_options WHERE id = $1 AND question_id = $2",
    answerOptionId,
    questionId,
  );
};

const deleteAnswerOptionsRelatedToQuestion = async (questionId) => {
  await executeQuery(
    "DELETE FROM question_answer_options WHERE question_id = $1",
    questionId,
  );
};

const deleteAnswersRelatedToAnswerOption = async (answerOptionId) => {
  await executeQuery(
    "DELETE FROM question_answers WHERE question_answer_option_id = $1",
    answerOptionId,
  );
};

const deleteAnswersRelatedToQuestion = async (questionId) => {
  await executeQuery(
    "DELETE FROM question_answers WHERE question_id = $1",
    questionId,
  );
};

const getAnswerOptionsByQuestionId = async (questionId) => {
  const res = await executeQuery(
    "SELECT * FROM question_answer_options WHERE question_id = $1",
    questionId,
  );
  return res.rows;
};

const getAnswerOption = async (answerOptionId, questionId) => {
  const res = await executeQuery(
    "SELECT * FROM question_answer_options WHERE id = $1 AND question_id = $2",
    answerOptionId,
    questionId,
  );
  return res.rows;
};

const getQuestionAnswersByUserId = async (userId) => {
  const res = await executeQuery(
    "SELECT * FROM question_answers WHERE user_id = $1",
    userId,
  );
  return res.rows;
};

const getCountOfAnsweredQuestionsMadeByUserId = async (userId) => {
  const res = await executeQuery(
    `SELECT count(*) FROM questions Q 
    JOIN question_answer_options QAO ON Q.id = QAO.question_id 
    JOIN question_answers QA ON QAO.id = QA.question_answer_option_id 
    WHERE Q.user_id = $1 AND QA.user_id != $1`,
    userId,
  );
  return res.rows[0];
};

const getFiveUsersWithMostAnsweredQuestions = async () => {
  const res = await executeQuery(
    `SELECT U.email as email, count(*) as count FROM users U
    JOIN question_answers QA ON U.id = QA.user_id
    GROUP BY U.email
    ORDER BY count DESC
    LIMIT 5`,
  );
  return res.rows;
};

export {
  addAnswerOption,
  addQuestionAnswer,
  deleteAnswerOption,
  deleteAnswerOptionsRelatedToQuestion,
  deleteAnswersRelatedToAnswerOption,
  deleteAnswersRelatedToQuestion,
  getAnswerOption,
  getAnswerOptionsByQuestionId,
  getCountOfAnsweredQuestionsMadeByUserId,
  getFiveUsersWithMostAnsweredQuestions,
  getQuestionAnswersByUserId,
};
