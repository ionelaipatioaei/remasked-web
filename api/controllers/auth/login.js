const bcrypt = require("bcrypt");
const db = require("../../database/query");

module.exports = (req, res) => {
  const {username, password} = req.body;

  if (username && password) {
    const query = `SELECT id, password 
                    FROM users 
                    WHERE username=$1`;

    const queryParams = [username];

    db.query(query, queryParams, (error, result) => {
      if (!error && result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (passwordError, passwordIsMatching) => {
          if (!passwordError && passwordIsMatching) {
            //set the session id
            req.session.userId = result.rows[0].id;
            res.status(200).json({success: "You are now authenticated!"});
          } else {
            res.status(401).json({error: "Incorrect username or password!"});
          }
        });
      } else {
        res.status(401).json({error: "Incorrect username or password!"});
      }
    });
  } else {
    res.status(401).json({error: "Username and password fields can't be empty!"});
  }
}