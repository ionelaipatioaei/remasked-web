exports.login = (req, res) => {
  res.render("auth/login", {});
}

exports.register = (req, res) => {
  res.render("auth/register", {});
}

exports.recover = (req, res) => {
  res.render("auth/recover", {});
}

exports.logout = (req, res) => {
  res.redirect("/");
}