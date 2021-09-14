import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const newRandomQuestion = async ({ response }) => {
  const questions = await questionService.getAllProperQuestions();
  if (questions.length > 0) {
    const question = questions[Math.floor(Math.random() * questions.length)];
    response.redirect(`/quiz/${question.id}`);
  } else {
    response.body =
      "There are no questions to show so far. Maybe add some?<br/><a href='/'>Main page</a>";
  }
};

const showQuestion = async ({ params, response, render }) => {
  const data = {
    questionId: "",
    questionText: "",
    answerOptions: null,
  };

  const properQuestions = await questionService.getAllProperQuestions();
  if (!properQuestions.some((question) => question.id == params.id)) {
    response.status = 401;
    return;
  }

  const question = await questionService.getQuestionById(params.id);
  data.questionText = question[0].question_text;
  data.questionId = params.id;
  data.answerOptions = await answerService.getAnswerOptionsByQuestionId(
    params.id,
  );

  render("quiz.eta", data);
};

const saveQuestionAnswer = async ({ params, response, user }) => {
  const option = await answerService.getAnswerOption(
    params.optionId,
    params.id,
  );
  if (option.length > 0) {
    if (option[0].is_correct) {
      await answerService.addQuestionAnswer(
        user.id,
        params.id,
        params.optionId,
        true,
      );
      response.redirect(`/quiz/${params.id}/correct`);
    } else {
      await answerService.addQuestionAnswer(
        user.id,
        params.id,
        params.optionId,
        false,
      );
      response.redirect(`/quiz/${params.id}/incorrect`);
    }
  } else {
    response.status = 404;
  }
};

const rightAnswer = ({ render }) => {
  render("quiz_feedback.eta", { correct: true });
};

const wrongAnswer = async ({ params, render }) => {
  const res = await answerService.getAnswerOptionsByQuestionId(params.id);
  const correct = res.find((option) => option.is_correct);

  render("quiz_feedback.eta", { correct: false, text: correct.option_text });
};

export {
  newRandomQuestion,
  rightAnswer,
  saveQuestionAnswer,
  showQuestion,
  wrongAnswer,
};
