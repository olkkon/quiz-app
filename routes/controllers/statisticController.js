import * as answerService from "../../services/answerService.js";

const showStatisticPage = async ({ user, render }) => {
  const data = {
    email: "",
    numberOfAnswers: "",
    numberOfCorrectAnswers: "",
    otherAnswers: "",
    mostAnsweredQuestions: null,
  };
  const res1 = await answerService.getQuestionAnswersByUserId(user.id);

  data.email = user.email;
  data.numberOfAnswers = res1.length;
  data.numberOfCorrectAnswers =
    res1.filter((answer) => answer.correct == true).length;

  const res2 = await answerService.getCountOfAnsweredQuestionsMadeByUserId(
    user.id,
  );
  data.otherAnswers = res2.count;
  data.mostAnsweredQuestions = await answerService
    .getFiveUsersWithMostAnsweredQuestions();

  render("statistics.eta", data);
};

export { showStatisticPage };
