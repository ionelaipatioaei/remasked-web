const bcrypt = require("bcrypt");
const db = require("../../database/query");

module.exports = (req, res) => {
  const {username, password} = req.body;

  if (username && password) {
    db.query(`SELECT id, password FROM users WHERE username=$1`, [username], (error, result) => {
      if (!error && result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (passwordError, passwordIsMatching) => {
          if (!passwordError && passwordIsMatching) {
            //set the session id
            req.session.userId = result.rows[0].id;
            res.json({success: "Login successful!"});
          } else {
            res.json({error: "Username and password don't match!"});
          }
        });
      } else {
        res.json({error: "Username and password don't match!"});
      }
    });
  } else {
    res.json({error: "Invalid credentials!"});
  }
}