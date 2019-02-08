const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const PORT = 8080;

app.use("/static", express.static(__dirname + "/static"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ type: '*/*' }));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", {val: "hey there"});
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));