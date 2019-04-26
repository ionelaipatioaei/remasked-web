exports.about = (req, res) => {
  res.render("misc/about", {logged: req.session.userId !== undefined});
}

exports.contact = (req, res) => {
  res.render("misc/contact", {logged: req.session.userId !== undefined});
}

exports.apps = (req, res) => {
  res.render("misc/apps", {logged: req.session.userId !== undefined});
}

exports.donate = (req, res) => {
  res.render("misc/donate", {logged: req.session.userId !== undefined});
}

exports.termsOfUse = (req, res) => {
  res.render("misc/termsOfUse", {logged: req.session.userId !== undefined});
}

exports.privacyPolicy = (req, res) => {
  res.render("misc/privacyPolicy", {logged: req.session.userId !== undefined});
}