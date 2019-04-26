const db = require("../../database/query");

// TODO:
// 1. community search
// 2. user search
module.exports = (req, res) => {
  const {q} = req.query;
  const query = `SELECT title FROM post WHERE title ILIKE '%' || $1 || '%'`;

  const queryParams = [q];
  db.query(query, queryParams, (error, result) => {
    if (!error) {
      res.status(200).json({posts: result.rows});
    } else {
      res.status(502).json({error: "Something went wrong!"});
    }
  });
}