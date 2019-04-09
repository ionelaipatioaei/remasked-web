const Pool = require("pg").Pool;
const db = new Pool();

exports.commentAdd = (req, res) => {
  const {refPost, refComment, content} = req.body;
  // console.log(refPost, refComment, content);
  if (req.session.userId) {
    const query = refComment ?
      // comment to a parent
      `INSERT INTO comment (owner, content, post_parent, comment_parent) 
        VALUES ($1, $2, (SELECT id FROM post WHERE ref_string=$3), (SELECT id FROM comment WHERE ref_string=$4))` 
      :
      // comment to a post
      `INSERT INTO comment (owner, content, post_parent, comment_parent) 
        VALUES ($1, $2, (SELECT id FROM post WHERE ref_string=$3), NULL)`;

    const queryParams = refComment ? [req.session.userId, content, refPost, refComment] : [req.session.userId, content, refPost];

    db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "Your comment was registered!"});
      }
    });
  } else {
    res.json({error: "You need to have an account in order to comment!"});
  }
}

exports.commentEdit = (req, res) => {
  const {refComment, editedText} = req.body;

  if (req.session.userId) {
    const query = `UPDATE comment SET content=$1, edited=NOW() WHERE ref_string=$2 AND owner=$3`;

    const queryParams = [editedText, refComment, req.session.userId];

    db.query(query, queryParams, (error, result) => {
      if (!error && result.rowCount > 0) {
        res.json({success: "Your comment was updated!"});
      } else {
        res.json({error: "Something went wrong or this isn't your comment!"});
      }
    });
  } else {
    res.json({error: "You need an account in order to edit a comment!"});
  }
}

exports.commentDelete = (req, res) => {
  const {refComment} = req.body;

  const deleteVotes = async (refComment, id, next) => {
    const query = `DELETE FROM vote_comment 
      WHERE comment_id=(SELECT id FROM comment WHERE ref_string=$1)`;

    const queryParams = [refComment];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        next(refComment, id);
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const updateCommentToNull = async (refComment, id) => {
    const query = `UPDATE comment SET owner=NULL, created=NULL, content=NULL, edited=NULL, deleted=TRUE 
      WHERE ref_string=$1 AND owner=$2`;

    const queryParams = [refComment, id];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "Your comment was deleted!"});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  if (req.session.userId) {
    deleteVotes(refComment, req.session.userId, updateCommentToNull);
  } else {
    res.json({error: "You need an account in order to delete a comment!"});
  }
}