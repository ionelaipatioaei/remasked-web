const db = require("../../database/query");

module.exports = (req, res) => {
  const {refPost, refComment} = req.body;

  const updateSavedPostsAndComments = async (refPost, refComment, id) => {
    const query = refComment ?
      `SELECT EXISTS(
        SELECT 1 FROM save_comment 
          WHERE user_id=$1 
          AND comment_id=(SELECT id FROM comment WHERE ref_string=$2)
        )`
      :
      `SELECT EXISTS(
        SELECT 1 FROM save_post 
        WHERE user_id=$1 
          AND post_id=(SELECT id FROM post WHERE ref_string=$2)
        )`;

    const queryParams = refComment ? [id, refComment] : [id, refPost];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        if (result.rows[0].exists) {
          removeSave(refPost, refComment, id);
        } else {
          addSave(refPost, refComment, id);
        }
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const addSave = async (refPost, refComment, id) => {
    const query = refComment ?
      // comment
      `INSERT INTO save_comment (user_id, comment_id) 
        VALUES (
          $1, 
          (SELECT id FROM comment WHERE ref_string=$2)
        )` 
      :
      // post
      `INSERT INTO save_post (user_id, post_id) 
        VALUES (
          $1, 
          (SELECT id FROM post WHERE ref_string=$2)
        )`;

    const queryParams = refComment ? [id, refComment] : [id, refPost];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "Your save was added!"});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const removeSave = async (refPost, refComment, id) => {
    const query = refComment ?
      // comment
      `DELETE FROM save_comment 
        WHERE user_id=$1 
        AND comment_id=(SELECT id FROM comment WHERE ref_string=$2)` 
      :
      // post
      `DELETE FROM save_post 
        WHERE user_id=$1 
        AND post_id=(SELECT id FROM post WHERE ref_string=$2)`;

    const queryParams = refComment ? [id, refComment] : [id, refPost];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "Your save was removed!", remove: true});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  if (req.session.userId) {
    if (refPost && refComment) {
      res.json({error: "You can only update one item at a time!"});
    } else {
      updateSavedPostsAndComments(refPost, refComment, req.session.userId);
    }
  } else {
    res.json({error: "You need an account in order to save a post/comment!"});
  }
}