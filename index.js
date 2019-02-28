const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// NEEDS PRODUCTION CONFIGS
const PORT = 8081;

// STATIC RESOURCES
app.use("/static", express.static(__dirname + "/static"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ type: '*/*' }));
app.set("view engine", "pug");

// API ROUTES
const apiAuth = require("./api/routes/auth");
app.use("/api/auth", apiAuth);

// FRONT-END ROUTES
const auth = require("./routes/auth");
app.use(auth);

const navigation = require("./routes/navigation");
app.use(navigation);

const misc = require("./routes/misc");
app.use(misc);

// MISC ROUTES
app.get("/", (req, res) => {
  res.render("index", {val: "hey there"});
});

app.get("*", (req, res) => {
  res.send("Looks like you are lost!");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));