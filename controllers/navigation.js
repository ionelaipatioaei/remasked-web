const request = require("request");
const fetch = require("node-fetch");

exports.profile = (req, res) => {
  const name = req.params.name;
  if (!name) {
    res.render("navigation/profile", {logged: req.session.userId !== undefined, you: true});
  } else {
    // res.send(`profile: ${req.params.name}`);
    res.render("navigation/profile", {logged: req.session.userId !== undefined, you: false, name: name});
  }
}

exports.c = (req, res) => {
  const name = req.params.name;

  request(`http://localhost:8081/api/c/${name}`, (error, response, renderData) => {
    if (!error) {
      res.render("navigation/gen/c", {logged: req.session.userId !== undefined, name: name, ...JSON.parse(renderData)});
    }
  });

  // res.render("navigation/gen/c", {logged: req.session.userId !== undefined, name: name, posts: [
  //   {type: "photo", flag: "NSFW", title: "Very nice tree which I took a photo of", owner: "ilovetrees", source: "https://images.pexels.com/photos/56875/tree-dawn-nature-bucovina-56875.jpeg?cs=srgb&dl=campulung-countryside-dawn-56875.jpg&fm=jpg"},
  //   {type: "photo", flag: null, title: "My first time painting", owner: "painter", source: "https://i.ytimg.com/vi/tog3dRQxENs/maxresdefault.jpg"},
  //   {type: "photo", flag: null, title: "Nature is amazing", owner: "lionel2", source: "https://image.redbull.com/rbcom/010/2015-07-27/1331737542701_2/0010/1/1500/1000/1/moon-hill-natural-bridge-in-china.jpg"},
  //   {type: "photo", flag: null, title: "Beautiful tree thingy", owner: "heyhey", source: "http://www.9skips.com/wp-content/uploads/2017/10/forests.jpg"},
  //   {type: "photo", flag: null, title: "Wide photo of me looking at nature.", owner: "wideme", source: "https://images.france.fr/zeaejvyq9bhj/2xwcRbXG0IoQIqw42g2w0C/34a143432d9da929e818a81edf16e0c3/1120x490_Nature.jpg?w=1120&h=491&q=70&fl=progressive&fit=fill"},
  //   {type: "photo", flag: null, title: "Flower. Yellow Flower.", owner: "flo", source: "https://preview.redd.it/a4n1yqwgaoj21.jpg?width=576&auto=webp&s=fc45d3f3cb6087e2c3c9f01d4957bf27fc94a1cb"},
  //   {type: "photo", flag: null, title: "Stones stacked together", owner: "ilvu", source: "https://www.difrusciaphotography.com/wp-content/uploads/2015/07/live_before_you_die02.jpg"},
  //   {type: "photo", flag: "NSFL", title: "Just a cat", owner: "catsss", source: "https://media.giphy.com/media/PcwpnqpwAfRK/giphy.gif"},
  //   {type: "video", flag: null, title: "This is a video", owner: "videosfordays", source: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"},
  //   {type: "text", flag: null, title: "Stones stacked together", owner: "ilvu", source: `https://www.difrusciaphotography.com/wp-content/uploads/&lt ;br&gt; 2015/07/live_before_you_die02.jpg`},
  //   {type: "link", flag: "NSFW", title: "Stones stacked together", owner: "ilvu", source: "https://www.difrusciaphotography.com/wp-content/uploads/2015/07/live_before_you_die02.jpg"}
  // ]});
}

exports.post = (req, res) => {
  const {name, id} = req.params;

  // request({uri: `http://localhost:8081/api/post/${id}`, method: "GET", withCredentials: true}, (error, response, renderData) => {
  //   if (!error) {
  //     // console.log(renderData);
  //     res.render("navigation/gen/post", {logged: req.session.userId !== undefined, name: name, ...JSON.parse(renderData)});
  //   }
  // });

  fetch(`http://localhost:8081/api/post/${id}`, {
    method: "GET",
    credentials: "include",
    'Access-Control-Allow-Credentials': true
  })
    .then(res => res.json())
    .then(data => {
      res.render("navigation/gen/post", {logged: req.session.userId !== undefined, name: name, ...data});
    })
    .catch(error => console.log(error));
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