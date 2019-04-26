const db = require("../../database/query");

module.exports = (req, res) => {
  const {refPost, refComment} = req.body;

  const throwawayCheck = async (refPost, refComment, id) => {
    const query = refComment ?
      `SELECT throwaway FROM comment WHERE owner=$1 AND ref_string=$2`
      :
      `SELECT throwaway FROM post WHERE owner=$1 AND ref_string=$2`;
    const queryParams = refComment ? [id, refComment] : [id, refPost];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        if (result.rows.length) {
          if (!result.rows[0].throwaway) {
            conceal(refPost, refComment, id);
          } else {
            reveal(refPost, refComment, id);
          }
        } else {
          // we should do more checking for unauthorized stuff but this is enough
          res.status(403).json({error: "Unauthorized to conceal/reveal this comment/post!"});
        }
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  // set to throwaway TRUE
  const conceal = async (refPost, refComment, id) => {
    const query = refComment ?
    `UPDATE comment SET throwaway=TRUE WHERE owner=$1 AND ref_string=$2`
    :
    `UPDATE post SET throwaway=TRUE WHERE owner=$1 AND ref_string=$2`;
    const queryParams = refComment ? [id, refComment] : [id, refPost];

    await db.query(query, queryParams, (error, result) => {
      if (!error && result.rowCount) {
        res.status(200).json({success: "Your comment/post was concealed!"});
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  // set to throwaway FALSE
  const reveal = async (refPost, refComment, id) => {
    const query = refComment ?
    `UPDATE comment SET throwaway=FALSE WHERE owner=$1 AND ref_string=$2`
    :
    `UPDATE post SET throwaway=FALSE WHERE owner=$1 AND ref_string=$2`;
    const queryParams = refComment ? [id, refComment] : [id, refPost];

    await db.query(query, queryParams, (error, result) => {
      if (!error && result.rowCount) {
        res.status(200).json({success: "Your comment/post was revealed!"});
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  if (req.session.userId) {
    if (refPost && refComment) {
      res.status(400).json({error: "You can only update one item at a time!"});
    } else {
      throwawayCheck(refPost, refComment, req.session.userId);
    }
  } else {
    res.status(401).json({error: "You need to be authenticated in order to conceal/reveal a comment/post!"});
  }
}