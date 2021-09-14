import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";
import { validasaur } from "../../deps.js";

const showQuestionPage = async ({ user, render }) => {
  const data = await questionService.getQuestionsByUserId(user.id);
  render("questions.eta", { title: "", questionText: "", questions: data });
};

// A helper function to handle form data and arising errors easier
const getAllQuestions = async (id, request) => {
  const data = {
    title: "",
    questionText: "",
    errors: null,
    questions: null,
  };
  data.questions = await questionService.getQuestionsByUserId(id);

  if (request) {
    const body = request.body({ type: "form" });
    const params = await body.value;
    data.title = params.get("title");
    data.questionText = params.get("question_text");
  }
  return data;
};

const addQuestion = async ({ request, response, user, render }) => {
  const validationRules = {
    title: [validasaur.required, validasaur.minLength(1)],
    questionText: [validasaur.required, validasaur.minLength(1)],
  };

  const data = await getAllQuestions(user.id, request);
  const [passes, errors] = await validasaur.validate(data, validationRules);

  if (!passes) {
    data.errors = errors;
    render("questions.eta", data);
  } else {
    await questionService.addQuestion(user.id, data.title, data.questionText);
    response.redirect("/questions");
  }
};

const deleteQuestion = async ({ params, response, user }) => {
  const res = await questionService.getQuestion(params.id, user.id);
  if (res.length > 0) {
    await answerService.deleteAnswersRelatedToQuestion(params.id);
    await answerService.deleteAnswerOptionsRelatedToQuestion(params.id);
    await questionService.deleteQuestion(params.id, user.id);
    response.redirect("/questions");
  } else {
    response.status = 401;
  }
};

const showQuestion = async ({ params, response, user, render }) => {
  const data = await getQuestion(params.id, user.id);
  if (!data) {
    response.status = 404;
  } else {
    render("question.eta", data);
  }
};

// A helper function to handle form data and arising errors easier
const getQuestion = async (id, userId, request) => {
  const data = {
    id: id,
    title: "",
    questionText: "",
    optionText: "",
    isCorrect: false,
    errors: null,
    answerOptions: null,
  };

  data.answerOptions = await answerService.getAnswerOptionsByQuestionId(id);
  const question = await questionService.getQuestion(id, userId);

  if (question.length > 0) {
    data.title = question[0].title;
    data.questionText = question[0].question_text;
  } else {
    return false; // User has no access right to requested question
  }

  if (request) {
    const body = request.body({ type: "form" });
    const params = await body.value;

    data.optionText = params.get("option_text");
    if (params.get("is_correct")) {
      data.isCorrect = true;
    } else {
      data.isCorrect = false;
    }
  }
  return data;
};

const addAnswerOption = async (
  { params, request, response, user, render },
) => {
  const validationRules = {
    optionText: [validasaur.required, validasaur.minLength(1)],
  };

  const data = await getQuestion(params.id, user.id, request);
  if (!data) {
    response.status = 401;
    return;
  }
  const [passes, errors] = await validasaur.validate(data, validationRules);

  if (!passes) {
    data.errors = errors;
    data.id = params.id;
    render("question.eta", data);
    return;
  }

  if (
    data.isCorrect &&
    data.answerOptions.some((option) => option.is_correct)
  ) {
    data.errors = {
      formatting: {
        bool: "There exist already an option which is right for this question",
      },
    };
    data.id = params.id;
    render("question.eta", data);
    return;
  }

  await answerService.addAnswerOption(
    params.id,
    data.optionText,
    data.isCorrect,
  );
  response.redirect(`/questions/${params.id}`);
};

const deleteAnswerOption = async ({ params, response, user }) => {
  const res = await questionService.getQuestion(params.questionId, user.id);

  if (res.length > 0) {
    await answerService.deleteAnswersRelatedToAnswerOption(params.optionId);
    await answerService.deleteAnswerOption(
      params.optionId,
      params.questionId,
    );
    response.redirect(`/questions/${params.questionId}`);
  } else {
    response.status = 401;
  }
};

export {
  addAnswerOption,
  addQuestion,
  deleteAnswerOption,
  deleteQuestion,
  showQuestion,
  showQuestionPage,
};
