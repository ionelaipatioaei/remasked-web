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

  res.render("navigation/gen/c", {name: name, posts: [
    {title: "Hey 1", owner: "lionel"},
    {title: "Hey 2", owner: "lionel1"},
    {title: "Hey 3", owner: "lionel2"},
  ]});
}

exports.post = (req, res) => {
  const {name, id} = req.params;

  res.render("navigation/gen/post", {name: name, title: "Random shit!", comments: [
    {owner: "wii1", content: "Hey there1"},
    {owner: "wii2", content: "Hey there2"},
    {owner: "wii3", content: "Hey there3"}
  ]});
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