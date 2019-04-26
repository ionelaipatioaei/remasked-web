const bcrypt = require("bcrypt");
const db = require("../../database/query");
const checkName = require("../../shared/checkName");

module.exports = (req, res) => {
  const {username, email, password, confirmPassword} = req.body;

  if (username.length >= 3 && password.length >= 8) {
    if (password === confirmPassword) {
      if (checkName(username)) {

        bcrypt.hash(password, 10, (hashError, hash) => {
          if (!hashError) {
            const query = `INSERT INTO users (username, password, email) 
                          VALUES ($1, $2, $3)`;
            const queryParams = [username, hash, email];

            db.query(query, queryParams, (error, result) => {
              if (!error) {
                res.status(200).json({success: "The account was registered successfully!"});
              } else {
                if (error.constraint === "users_username_key") {
                  res.status(409).json({error: "Username is already used by somebody!"});
                } else if (error.constraint === "users_email_key") {
                  res.status(409).json({error: "The email is already used by somebody!"});
                } else {
                  res.status(502).json({error: "Something went wrong!"});
                }
              }
            });
          } else {
            res.status(500).json({error: "Something went wrong!"});
          }
        });
      } else {
        res.status(400).json({error: "Username needs to be alphanumeric!"});
      }
    } else {
      res.status(400).json({error: "Passwords don't match!"});
    }
  } else {
    res.status(400).json({error: "Username needs to be at least 3 characters long and password at least 8!"});
  }
}