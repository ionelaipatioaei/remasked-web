const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

// NEEDS PRODUCTION CONFIGS
const PORT = 8081;

// STATIC RESOURCES
app.use("/static", express.static(__dirname + "/static"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ type: '*/*' }));
app.set("view engine", "pug");

// SESSION
app.use(session({
  name: "sid",
  saveUninitialized: false,
  resave: false,
  // should be more secret
  secret: "hey there",
  cookie: {
    maxAge: 1000 * 60 * 60,
    sameSite: true,
    secure: false ,
    // httpOnly: true
  }
}));

app.use((req, res, next) => {
  console.log(req.session.userId);
  next();
});

// API ROUTES
const apiAuth = require("./api/routes/auth");
app.use("/api/auth", apiAuth);

const apiNavigation = require("./api/routes/navigation");
app.use("/api", apiNavigation);

const apiInteraction = require("./api/routes/interaction");
app.use("/api", apiInteraction);

// FRONT-END ROUTES
const auth = require("./routes/auth");
app.use(auth);

const navigation = require("./routes/navigation");
app.use(navigation);

const misc = require("./routes/misc");
app.use(misc);

// MISC ROUTES
const apiExplore = require("./api/controllers/navigation/explore");
app.get("/", apiExplore("render"));

app.get("*", (req, res) => {
  res.render("misc/notFound", {logged: req.session.userId !== undefined});
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));