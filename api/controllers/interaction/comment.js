const db = require("../../database/query");

exports.add = (req, res) => {
  const {refPost, refComment, content} = req.body;
  if (req.session.userId) {
    const query = refComment ?
      // comment to another comment
      `INSERT INTO comment (owner, content, post_parent, comment_parent) 
        VALUES (
          $1, $2, 
          (SELECT id FROM post WHERE ref_string=$3), 
          (SELECT id FROM comment WHERE ref_string=$4)
        )`
      :
      // comment to a post
      `INSERT INTO comment (owner, content, post_parent, comment_parent) 
        VALUES (
          $1, $2, 
          (SELECT id FROM post WHERE ref_string=$3), 
          NULL
        )`;

    const queryParams = refComment ? [req.session.userId, content, refPost, refComment] : [req.session.userId, content, refPost];

    db.query(query, queryParams, (error, result) => {
      // you could also check the error and after that the rowCount so if 
      // nothing was inserted you could send a different error but eh, good enough for now
      if (!error && result.rowCount) {
        res.status(200).json({success: "Your comment was added!"});
      } else {
        res.status(502).json({error: "Something went wrong!"})
      }
    });
  } else {
    res.status(401);
    res.json({error: "You need to be authenticated in order to add a comment!"});
  }
}

exports.edit = (req, res) => {
  const {refComment, editedText} = req.body;

  if (req.session.userId) {
    const query = `UPDATE comment 
                    SET content=$1, edited=NOW() 
                    WHERE ref_string=$2 AND owner=$3`;

    const queryParams = [editedText, refComment, req.session.userId];

    db.query(query, queryParams, (error, result) => {
      if (!error) {
        // if nothing is updated(rowCount=0) it means that the authenticated user
        // tried to update a comment which it doesn't own
        // idk if there can be other cases when the rowCount=0 tho
        if (result.rowCount) {
          res.status(200).json({success: "Your comment was edited!"});
        } else {
          res.status(403).json({error: "Unauthorized to edit this comment!"});
        }
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  } else {
    res.status(401).json({error: "You need to be authenticated in order to edit a commnet!"});
  }
}

exports.delete = (req, res) => {
  const {refComment} = req.body;

  const deleteVotes = async (refComment, id, next) => {
    const query = `DELETE FROM vote_comment 
                    WHERE comment_id=(
                      SELECT id FROM comment WHERE ref_string=$1
                    )`;

    const queryParams = [refComment];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        next(refComment, id);
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  const updateCommentToNull = async (refComment, id) => {
    const query = `UPDATE comment 
                    SET owner=NULL, created=NULL, content=NULL, edited=NULL, 
                      deleted=TRUE 
                    WHERE ref_string=$1 AND owner=$2`;

    const queryParams = [refComment, id];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        if (result.rowCount) {
          res.status(200).json({success: "Your comment was deleted!"});
        } else {
          res.status(403).json({error: "Unauthorized to delete this comment!"});
        }
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  if (req.session.userId) {
    deleteVotes(refComment, req.session.userId, updateCommentToNull);
  } else {
    res.status(401).json({error: "You need to be authenticated in order to delete a comment!"});
  }
}