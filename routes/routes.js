import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as quizController from "./controllers/quizController.js";
import * as statisticController from "./controllers/statisticController.js";
import * as quizApi from "./apis/quizApi.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/questions", questionController.showQuestionPage);
router.post("/questions", questionController.addQuestion);
router.get("/questions/:id", questionController.showQuestion);

router.post("/questions/:id/options", questionController.addAnswerOption);
router.post(
  "/questions/:questionId/options/:optionId/delete",
  questionController.deleteAnswerOption,
);
router.post("/questions/:id/delete", questionController.deleteQuestion);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.logIn);
router.get("/auth/logout", loginController.logOut);

router.get("/quiz", quizController.newRandomQuestion);
router.get("/quiz/:id", quizController.showQuestion);
router.post("/quiz/:id/options/:optionId", quizController.saveQuestionAnswer);
router.get("/quiz/:id/correct", quizController.rightAnswer);
router.get("/quiz/:id/incorrect", quizController.wrongAnswer);

router.get("/statistics", statisticController.showStatisticPage);

router.get("/api/questions", quizApi.showInfoPage);
router.get("/api/questions/random", quizApi.returnRandomQuestion);
router.post("/api/questions/answer", quizApi.answerQuestion);

export { router };
