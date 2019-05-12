const bcrypt = require("bcrypt");
const db = require("../../database/query");

module.exports = (req, res) => {
  const {username, password} = req.body;

  if (username && password) {
    const query = `SELECT id, username, password 
                    FROM users 
                    WHERE unique_name=$1`;

    const queryParams = [username.toLowerCase()];

    db.query(query, queryParams, (error, result) => {
      if (!error && result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (passwordError, passwordIsMatching) => {
          if (!passwordError && passwordIsMatching) {
            // set the session id
            req.session.userId = result.rows[0].id;
            // req.session.username = result.rows[0].username;
            res.status(200).json({success: "You are now authenticated!"});
          } else {
            res.status(401).json({error: "Incorrect username or password!"});
          }
        });
      } else {
        // this doesn't handle a 502 error
        // may fix it later
        res.status(401).json({error: "Incorrect username or password!"});
      }
    });
  } else {
    res.status(401).json({error: "Username and password fields can't be empty!"});
  }
}