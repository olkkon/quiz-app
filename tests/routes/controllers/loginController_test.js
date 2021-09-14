import { app } from "../../../app.js";
import { superoak } from "https://deno.land/x/superoak@4.3.0/mod.ts";

// ADD YOUR OWN VALUES
const email = "";
const password = "";

Deno.test({
  name:
    "4: POST request to /auth/login with correct credentials should redirect to /questions",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/auth/login")
      .send(`email=${email}&password=${password}`)
      .expect(302)
      .expect("Content-Type", new RegExp("text/plain"))
      .expect("Redirecting to /questions.");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name:
    "5: POST request to /auth/login with incorrect credentials should return login page",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/auth/login")
      .send(`email=incorrect&password=incorrect`)
      .expect(200)
      .expect("Content-type", new RegExp("text/html"))
      .expect(new RegExp("Login form"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
