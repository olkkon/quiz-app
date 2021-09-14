import { app } from "../../../app.js";
import { superoak } from "https://deno.land/x/superoak@4.3.0/mod.ts";

// ADD YOUR OWN VALUES
const email = "";
const password = "";

Deno.test({
  name:
    "6: GET request to /questions without being authenticated returns redirection to /auth/login",
  fn: async () => {
    const request = await superoak(app);
    await request.get("/questions")
      .expect(302)
      .expect("Content-Type", new RegExp("text/plain"))
      .expect("Redirecting to /auth/login.");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name:
    "7: GET request to /questions while being authenticated returns questions page",
  fn: async () => {
    const request1 = await superoak(app);
    const response = await request1.post("/auth/login")
      .send(`email=${email}&password=${password}`)
      .expect(302)
      .expect("Redirecting to /questions.");

    const request2 = await superoak(app);
    await request2.get("/questions")
      .set("Cookie", response.headers["set-cookie"].split(";")[0])
      .send()
      .expect(200)
      .expect(new RegExp("Questions!"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name:
    "8: POST request to /questions while being authenticated and without form data returns question page",
  fn: async () => {
    const request1 = await superoak(app);
    const response = await request1.post("/auth/login")
      .send(`email=${email}&password=${password}`)
      .expect(302)
      .expect("Redirecting to /questions.");

    const request2 = await superoak(app);
    await request2.post("/questions")
      .set("Cookie", response.headers["set-cookie"].split(";")[0])
      .send("title=&question_text=")
      .expect(200)
      .expect(new RegExp("Questions!"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
