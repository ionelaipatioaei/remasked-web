exports.submit = (req, res) => {
  res.render("navigation/submit", {logged: req.session.userId !== undefined, community: req.params.c});
}

exports.create = (req, res) => {
  res.render("navigation/create", {logged: req.session.userId !== undefined});
}

exports.communities = (req, res) => {
  res.render("navigation/communities", {logged: req.session.userId !== undefined});
}

exports.messages = (req, res) => {
  res.render("navigation/messages", {logged: req.session.userId !== undefined});
}

exports.notifications = (req, res) => {
  res.render("navigation/notifications", {logged: req.session.userId !== undefined});
}

exports.settings = (req, res) => {
  res.render("navigation/settings", {logged: req.session.userId !== undefined});
}