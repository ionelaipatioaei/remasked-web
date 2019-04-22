const db = require("../../database/query");

module.exports = (req, res) => {
  const {q} = req.query;
  const query = `SELECT title FROM post WHERE title LIKE '%' || $1 || '%'`;

  const queryParams = [q];
  db.query(query, queryParams, (error, result) => {
    if (!error) {
      res.json({r: result});
    } else {
      res.json({error: "Something went wrong!"});
    }
  });
}