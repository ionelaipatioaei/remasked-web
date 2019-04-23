const db = require("../../database/query");

exports.delete = (req, res) => {
  const {keepUsername} = req.body;

  const deletePostVotes = async (next) => {
    await db.query("DELETE FROM vote_post WHERE user_id=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteCommentVotes
        next(deleteSavedPosts);
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const deleteCommentVotes = async (next) => {
    await db.query("DELETE FROM vote_comment WHERE user_id=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteSavedPosts
        next(deleteSavedComments);
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const deleteSavedPosts = async (next) => {
    await db.query("DELETE FROM save_post WHERE user_id=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteSavedComments
        next(deleteSubscriptions);
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const deleteSavedComments = async (next) => {
    await db.query("DELETE FROM save_comment WHERE user_id=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteSubscriptions
        next(deletePosts);
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const deleteSubscriptions = async (next) => {
    await db.query("DELETE FROM subscription WHERE user_id=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deletePosts
        next(deleteComments);
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const deletePosts = async (next) => {
    const query = `UPDATE post 
                    SET owner=NULL, created=NULL, title=NULL, link=NULL, content=NULL, 
                      flag=NULL, edited=NULL, deleted=TRUE, type='text' 
                    WHERE owner=$1`;

    await db.query(query, [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteComments
        next(deleteCommunityFounder);
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const deleteComments = async (next) => {
    const query = `UPDATE comment 
                    SET owner=NULL, created=NULL, content=NULL, edited=NULL, deleted=TRUE 
                    WHERE owner=$1`;

    await db.query(query, [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteCommunityFounder
        next(deleteUser);
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const deleteCommunityFounder = async (next) => {
    await db.query("UPDATE community SET createdby=NULL WHERE createdby=$1", [req.session.userId], (error, result) => {
      if (!error) {
        // this next is deleteUser
        next();
      } else {
        res.json({error: "Something went wrong!"});
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
              res.json({error: "Something went wrong!"});
            }
            res.clearCookie("sid");
            res.json({success: "Your account was deleted!"});
          });
        } else {
          res.json({error: "Something went wrong!"});
        }
      });
  }

  if (req.session.userId) {
    deletePostVotes(deleteCommentVotes);
  } else {
    res.json({error: "You need to be logged into this account order to delete it!"});
  }
}