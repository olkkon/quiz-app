import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const returnRandomQuestion = async ({ response }) => {
  const questions = await questionService.getAllProperQuestions();

  if (questions.length > 0) {
    const question = questions[Math.floor(Math.random() * questions.length)];
    const answerOptions = await answerService.getAnswerOptionsByQuestionId(
      question.id,
    );

    const data = {
      questionId: question.id,
      questionTitle: question.title,
      questionText: question.question_text,
      answerOptions: answerOptions.map((option) => ({
        optionId: option.id,
        optionText: option.option_text,
      })),
    };
    response.body = data;
  } else {
    response.body = {};
  }
};

const answerQuestion = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const document = await body.value;
  if (document.questionId && document.optionId) {
    const res = await answerService.getAnswerOption(
      document.optionId,
      document.questionId,
    );
    if (res.length > 0) {
      response.body = { correct: res[0].is_correct };
    } else {
      response.body = {
        error: "Question- or answer option id not found from database",
      };
    }
  } else {
    response.body = {
      error: "Question- or answer option id not found from received body",
    };
  }
};

const showInfoPage = ({ user, render }) => {
  if (user) {
    render("api_info.eta", { auth: true });
  } else {
    render("api_info.eta");
  }
};

export { answerQuestion, returnRandomQuestion, showInfoPage };
