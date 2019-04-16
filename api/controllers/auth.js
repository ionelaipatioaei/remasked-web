const bcrypt = require("bcrypt");
const Pool = require("pg").Pool;
const db = new Pool();

// exports.login = (req, res) => {
//   const {username, password} = req.body;

//   if (username && password) {
//     db.query(`SELECT id, password FROM users WHERE username=$1`, [username], (error, result) => {
//       if (!error && result.rows.length) {
//         bcrypt.compare(password, result.rows[0].password, (passwordError, passwordIsMatching) => {
//           if (!passwordError && passwordIsMatching) {
//             //set the session id
//             req.session.userId = result.rows[0].id;
//             res.json({success: "Login successful!"});
//           } else {
//             res.json({error: "Username and password don't match!"});
//           }
//         });
//       } else {
//         res.json({error: "Username and password don't match!"});
//       }
//     });
//   } else {
//     res.json({error: "Invalid credentials!"});
//   }
// }

// exports.register = (req, res) => {
//   const {username, email, password, confirmPassword} = req.body;

//   if (password !== confirmPassword) {
//     res.json({error: "Passwords don't match!"});
//   } else if (password.length < 8) {
//     res.json({error: "Password needs to be at least 8 characters long!"});
//   } else {
//     if (username) {
//       bcrypt.hash(password, 10, (hashError, hash) => {
//         if (!hashError) {
//           db.query(`INSERT INTO users (username, password, email) VALUES ($1, $2, $3)`, [username, hash, email], (error, result) => {
//             if (!error) {
//               res.json({success: "Your account was registered successfully!"});
//             } else {
//               if (error.constraint === "users_username_key") {
//                 res.json({error: "Username already taken!"});
//               } else if (error.constraint === "users_email_key") {
//                 res.json({error: "The email is already used by somebody!"});
//               } else {
//                 res.json({error: "Something went wrong!"});
//               }
//             }
//           });
//         } else {
//           res.json({error: "Something went wrong!"});
//         }
//       });
//     } else {
//       res.json({error: "Username can't be empty!"});
//     }
//   }
// }

// exports.logout = (req, res) => {
//   req.session.destroy(error => {
//     if (error) {
//       res.json({error: "Something went wrong!"});
//     }
//     res.clearCookie("sid");
//     res.json({success: "Cookie deleted"});
//   });
// }

// exports.recover = (req, res) => {
//   res.json({recover: true});
// }