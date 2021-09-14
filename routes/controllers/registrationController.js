import { bcrypt, validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";

const validationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};

// A helper function to handle form data and arising errors easier
const getData = async (request) => {
  const data = {
    email: "",
    password: "",
    errors: null,
  };

  if (request) {
    const body = request.body({ type: "form" });
    const params = await body.value;

    data.email = params.get("email");
    data.password = params.get("password");
  }
  return data;
};

const registerUser = async ({ user, state, request, response, render }) => {
  const data = await getData(request);
  const [passes, errors] = await validasaur.validate(data, validationRules);

  if (!passes) {
    data.errors = errors;
    render("registration.eta", data);
  } else {
    if (user) {
      state.session.set("user", null);
    }
    await userService.addUser(data.email, await bcrypt.hash(data.password));
    response.redirect("/auth/login");
  }
};

const showRegistrationForm = ({ user, render }) => {
  if (user) {
    render("registration.eta", {
      email: "",
      password: "",
      authEmail: user.email,
    });
  } else {
    render("registration.eta", { email: "", password: "" });
  }
};

export { registerUser, showRegistrationForm };
