const db = require("../../database/query");

module.exports = (req, res) => {
  // this is so simple isn't worth a const
  db.query("SELECT unique_name FROM community ORDER BY random() LIMIT 1", [], (error, result) => {
    if (!error) {
      res.status(200).json({community: result.rows[0].unique_name});
    } else {
      res.status(502).json({error: "Something went wrong!"});
    }
  });
}