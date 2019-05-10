const bcrypt = require("bcrypt");
const db = require("../../database/query");

exports.addEmail = (req, res) => {
  res.status(202).json({error: "Work in progress!"});
}

exports.changePassword = (req, res) => {
  res.status(202).json({error: "Work in progress!"});
}

exports.changeEmail = (req, res) => {
  res.status(202).json({error: "Work in progress!"});
}

// TODO make the take into account result.rowCount when doing error checking

exports.delete = (req, res) => {
  const {password, keepUsername} = req.body;

  const deletePostVotes = async (next) => {
    await db.query("DELETE FROM vote_post WHERE user_id=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteCommentVotes
        next(deleteSavedPosts);
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  const deleteCommentVotes = async (next) => {
    await db.query("DELETE FROM vote_comment WHERE user_id=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteSavedPosts
        next(deleteSavedComments);
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  const deleteSavedPosts = async (next) => {
    await db.query("DELETE FROM save_post WHERE user_id=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteSavedComments
        next(deleteSubscriptions);
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  const deleteSavedComments = async (next) => {
    await db.query("DELETE FROM save_comment WHERE user_id=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteSubscriptions
        next(deletePosts);
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  const deleteSubscriptions = async (next) => {
    await db.query("DELETE FROM subscription WHERE user_id=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deletePosts
        next(deleteComments);
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  const deletePosts = async (next) => {
    const query = `UPDATE post 
                    SET owner=NULL, created=NULL, title=NULL, link=NULL, content=NULL, 
                      community=NULL, type=NULL, flag=NULL, edited=NULL, throwaway=NULL,
                      hidden=NULL, deleted=TRUE
                    WHERE owner=$1`;

    await db.query(query, [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteComments
        next(deleteCommunityFounder);
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  const deleteComments = async (next) => {
    const query = `UPDATE comment 
                    SET owner=NULL, created=NULL, content=NULL, edited=NULL, 
                    throwaway=NULL, hidden=NULL, deleted=TRUE 
                    WHERE owner=$1`;

    await db.query(query, [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteCommunityFounder
        next(deleteUser);
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  const deleteCommunityFounder = async (next) => {
    await db.query("UPDATE community SET createdby=NULL WHERE createdby=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteUser
        next();
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  const deleteUser = async () => {
    const query = keepUsername ?
      `UPDATE users SET email=NULL, password=NULL, created=NULL WHERE id=$1`
      :
      `DELETE FROM users WHERE id=$1`;

      await db.query(query, [req.session.userId], (error, result) => {
        if (!error) {
          // logout the user
          req.session.destroy(error => {
            if (error) {
              res.status(502).json({error: "Something went wrong!"});
            }
            res.clearCookie("sid");
            res.status(200).json({success: "Your account was deleted!"});
          });
        } else {
          res.status(502).json({error: "Something went wrong!"});
        }
      });
  }

  const confirmAction = async (next) => {
    const query = "SELECT password FROM users WHERE id=$1"

    await db.query(query, [req.session.userId], (error, result) => {
      if (!error && result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (passwordError, passwordIsMatching) => {
          if (!passwordError && passwordIsMatching) {
            next();
          } else {
            res.status(403).json({error: "Invalid password!"});
          }
        });
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  if (req.session.userId) {
    // check password and then delete
    confirmAction(() => deletePostVotes(deleteCommentVotes));
  } else {
    res.status(401).json({error: "You need to be authenticated in order to delete an account!"});
  }
}