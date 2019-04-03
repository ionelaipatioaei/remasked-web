const Pool = require("pg").Pool;
const db = new Pool();

exports.view = (req, res) => {
  const username = req.params.username;

  db.query(`SELECT username, created FROM users WHERE username=$1`, [username], (error, result) => {
    if (!error) {
      if (result.rows.length) {
        res.json(result.rows);
      } else {
        res.json({error: `Could not find user ${username}`});
      }
    } else {
      res.json({error});
    }
  });
}