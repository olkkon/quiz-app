const showMain = ({ user, render }) => {
  if (user) {
    render("main.eta", { auth: true });
  } else {
    render("main.eta");
  }
};

export { showMain };
