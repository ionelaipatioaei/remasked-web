exports.profile = (req, res) => {
  const name = req.params.name;
  if (!name) {
    res.render("navigation/profile", {you: true});
  } else {
    // res.send(`profile: ${req.params.name}`);
    res.render("navigation/profile", {you: false, name: name});
  }
}

exports.c = (req, res) => {
  const name = req.params.name;

  res.render("navigation/gen/c", {name: name});
}

exports.post = (req, res) => {
  const {name, id} = req.params;

  res.render("navigation/gen/post", {name: name, title: "Random shit!"});
}

exports.communities = (req, res) => {
  res.render("navigation/communities");
}

exports.messages = (req, res) => {
  res.render("navigation/messages");
}

exports.notifications = (req, res) => {
  res.render("navigation/notifications");
}

exports.settings = (req, res) => {
  res.render("navigation/settings");
}