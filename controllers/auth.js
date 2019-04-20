exports.login = (req, res) => {
  res.render("auth/login", {logged: req.session.userId !== undefined});
}

exports.register = (req, res) => {
  res.render("auth/register", {logged: req.session.userId !== undefined});
}

exports.recover = (req, res) => {
  res.render("auth/recover", {logged: req.session.userId !== undefined});
}

// this doesn't fucking make any sense because it somehow works
exports.logout = (req, res) => {
  res.redirect("/");
}