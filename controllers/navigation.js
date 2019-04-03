exports.profile = (req, res) => {
  const name = req.params.name;
  if (!name) {
    res.render("navigation/profile", {logged: req.session.userId !== undefined, you: true});
  } else {
    // res.send(`profile: ${req.params.name}`);
    res.render("navigation/profile", {logged: req.session.userId !== undefined, you: false, name: name});
  }
}

exports.submit = (req, res) => {
  res.render("navigation/submit", {logged: req.session.userId !== undefined, community: req.params.c});
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