import { app } from "../../../app.js";
import { superoak } from "https://deno.land/x/superoak@4.3.0/mod.ts";
import { assertExists } from "https://deno.land/std@0.100.0/testing/asserts.ts";

Deno.test({
  name:
    "1: GET request to /api/questions/random should return random question from database in correct format",
  fn: async () => {
    const request = await superoak(app);
    const response = await request.get("/api/questions/random")
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"));
    assertExists(response.body.questionId);
    assertExists(response.body.questionTitle);
    assertExists(response.body.questionText);
    assertExists(response.body.answerOptions);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

// ADD YOUR OWN VALUES
const questionId = 0;
const optionId = 0;

Deno.test({
  name:
    "2: POST request to /api/questions/answer with json data to correct answer should return { correct: 'true' }",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/questions/answer")
      .set("Content-Type", "application/json")
      .send(`{"questionId":${questionId},"optionId":${optionId}}`)
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"))
      .expect({ correct: true });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name:
    "3: POST request to /api/questions/answer with json data to non-existing answer should return { error: 'Question- or answer option id not found from database' }",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/questions/answer")
      .set("Content-Type", "application/json")
      .send('{"questionId":100,"optionId":100}')
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"))
      .expect({
        error: "Question- or answer option id not found from database",
      });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
