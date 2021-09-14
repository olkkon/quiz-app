import {
  assertEquals,
  assertExists,
  assertNotEquals,
} from "https://deno.land/std@0.100.0/testing/asserts.ts";
import * as questionService from "../../services/questionService.js";

// ADD YOUR OWN VALUE
const userId = 0;

Deno.test({
  name:
    "9: questionService method addQuestion should add question to database and deleteQuestion delete it from database",
  fn: async () => {
    await questionService.addQuestion(userId, "test", "test");
    const res = await questionService.getQuestionsByUserId(userId);

    const question = res.filter(
      (question) => (question.title == "test" &&
        question.question_text == "test"),
    );

    assertExists(question);
    await questionService.deleteQuestion(question[0].id, userId);

    const after = await questionService.getQuestionById(question[0].id);
    assertEquals(after, []);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name:
    "10: questionService method getAllProperQuestion should return some questions",
  fn: async () => {
    const res = await questionService.getAllProperQuestions();
    assertNotEquals(res, []);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
