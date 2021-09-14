import { executeQuery } from "../database/database.js";

const addQuestion = async (userId, title, questionText) => {
  await executeQuery(
    "INSERT INTO questions (user_id, title, question_text) VALUES ($1, $2, $3)",
    userId,
    title,
    questionText,
  );
};

const deleteQuestion = async (questionId, userId) => {
  await executeQuery(
    "DELETE FROM questions WHERE id = $1 AND user_id = $2",
    questionId,
    userId,
  );
};

const getQuestion = async (questionId, userId) => {
  const res = await executeQuery(
    "SELECT * FROM questions WHERE id = $1 AND user_id = $2",
    questionId,
    userId,
  );
  return res.rows;
};

// 'proper' means that question has at least one answer option which is correct
const getAllProperQuestions = async () => {
  const res = await executeQuery(
    `SELECT * FROM questions WHERE id IN (
     SELECT distinct question_id FROM question_answer_options)
       INTERSECT
     SELECT * FROM questions WHERE id NOT IN(
        SELECT distinct question_id FROM question_answer_options 
          EXCEPT 
        SELECT distinct question_id FROM question_answer_options WHERE is_correct = true)`,
  );
  return res.rows;
};

const getQuestionsByUserId = async (userId) => {
  const res = await executeQuery(
    "SELECT * FROM questions WHERE user_id = $1",
    userId,
  );
  return res.rows;
};

const getQuestionById = async (id) => {
  const res = await executeQuery(
    "SELECT * FROM questions WHERE id = $1",
    id,
  );
  return res.rows;
};

export {
  addQuestion,
  deleteQuestion,
  getAllProperQuestions,
  getQuestion,
  getQuestionById,
  getQuestionsByUserId,
};
