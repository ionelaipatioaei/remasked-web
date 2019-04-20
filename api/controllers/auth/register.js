const bcrypt = require("bcrypt");
const db = require("../../database/query");

module.exports = (req, res) => {
  const {username, email, password, confirmPassword} = req.body;

  if (password !== confirmPassword) {
    res.json({error: "Passwords don't match!"});
  } else if (password.length < 8) {
    res.json({error: "Password needs to be at least 8 characters long!"});
  } else {
    if (username) {
      bcrypt.hash(password, 10, (hashError, hash) => {
        if (!hashError) {
          const query = `INSERT INTO users (username, password, email) 
                          VALUES ($1, $2, $3)`;

          const queryParams = [username, hash, email];

          db.query(query, queryParams, (error, result) => {
            if (!error) {
              res.json({success: "Your account was registered successfully!"});
            } else {
              if (error.constraint === "users_username_key") {
                res.json({error: "Username already taken!"});
              } else if (error.constraint === "users_email_key") {
                res.json({error: "The email is already used by somebody!"});
              } else {
                res.json({error: "Something went wrong!"});
              }
            }
          });
        } else {
          res.json({error: "Something went wrong!"});
        }
      });
    } else {
      res.json({error: "Username can't be empty!"});
    }
  }
}