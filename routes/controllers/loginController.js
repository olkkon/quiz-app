import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";

const logIn = async ({ request, response, state, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const res = await userService.findByEmail(params.get("email"));
  if (res.length != 1) {
    render("login.eta", { error: "Incorrect login credentials" });
    return;
  }

  const match = await bcrypt.compare(params.get("password"), res[0].password);
  if (!match) {
    render("login.eta", { error: "Incorrect login credentials" });
    return;
  }

  await state.session.set("user", res[0]);
  response.redirect("/questions");
};

const logOut = async ({ response, state }) => {
  await state.session.set("user", null);
  response.redirect("/auth/login");
};

const showLoginForm = ({ user, render }) => {
  if (user) {
    render("logout.eta", { email: user.email });
  } else {
    render("login.eta", { email: "", password: "" });
  }
};

export { logIn, logOut, showLoginForm };
