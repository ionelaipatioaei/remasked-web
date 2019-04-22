const db = require("../../database/query");

module.exports = (req, res) => {
  // this is so simple isn't worth a const
  db.query("SELECT name FROM community ORDER BY random() LIMIT 1", [], (error, result) => {
    if (!error) {
      res.json({community: result.rows[0].name});
    } else {
      res.json({error: "Something went wrong!"});
    }
  });
}