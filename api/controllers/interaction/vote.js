const db = require("../../database/query");

module.exports = (req,res) => {
  const {refPost, refComment, vote} = req.body;

  const checkVoteAndModify = async (refPost, refComment, vote, id) => {
    const query = refComment ?
      // comment
      `SELECT vote FROM vote_comment 
        WHERE comment_id=(SELECT id FROM comment WHERE ref_string=$1) 
          AND user_id=$2` 
      :
      // post
      `SELECT vote FROM vote_post 
        WHERE post_id=(SELECT id FROM post WHERE ref_string=$1) 
          AND user_id=$2`;

    const queryParams = refComment ? [refComment, id] : [refPost, id];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        // add vote if there isn't one already
        if (!result.rows[0]) {
          // make sure that the vote has a 'good' value
          if (vote === 1 || vote === -1) {
            addVote(refPost, refComment, vote, id);
          } else {
            res.status(400).json({error: "Wrong vote value!"});
          }
        } else {
          // based on the current vote and the vote which the user requested, remove or update
          if (result.rows[0].vote === 1 && vote === 1) {
            removeVote(refPost, refComment, id);
          } else if (result.rows[0].vote === 1 && vote === -1) {
            updateVote(refPost, refComment, vote, id);
          } else if (result.rows[0].vote === -1 && vote === 1) {
            updateVote(refPost, refComment, vote, id);
          } else if (result.rows[0].vote === -1 && vote === -1) {
            removeVote(refPost, refComment, id);
          } else {
            res.status(400).json({error: "Wrong vote value!"});
          }
        } 
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  const addVote = async (refPost, refComment, vote, id) => {
    const query = refComment ?
      // comment
      `INSERT INTO vote_comment (user_id, comment_id, vote) 
        VALUES (
          $1, 
          (SELECT id FROM comment WHERE ref_string=$2), 
          $3
        )` 
      :
      // post
      `INSERT INTO vote_post (user_id, post_id, vote) 
        VALUES (
          $1, 
          (SELECT id FROM post WHERE ref_string=$2), 
          $3
        )`;

    const queryParams = refComment ? [id, refComment, vote] : [id, refPost, vote];

    await db.query(query, queryParams, (error, result) => {
      if (!error && result.rowCount) {
        res.status(200).json({success: "Your vote was registered!"});
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }
  
  const updateVote = async (refPost, refComment, vote, id) => {
    const query = refComment ?
      // comment
      `UPDATE vote_comment 
        SET vote=$1 
        WHERE comment_id=(SELECT id FROM comment WHERE ref_string=$2) 
          AND user_id=$3` 
      :
      // post
      `UPDATE vote_post 
        SET vote=$1 
        WHERE post_id=(SELECT id FROM post WHERE ref_string=$2) 
          AND user_id=$3`;

    const queryParams = refComment ? [vote, refComment, id] : [vote, refPost, id];

    await db.query(query, queryParams, (error, result) => {
      if (!error && result.rowCount) {
        res.status(200).json({success: "Your vote was registered!"});
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }
  
  const removeVote = async (refPost, refComment, id) => {
    const query = refComment ?
      // comment
      `DELETE FROM vote_comment 
        WHERE user_id=$1 
          AND comment_id=(SELECT id FROM comment WHERE ref_string=$2)` 
      :
      // post
      `DELETE FROM vote_post 
        WHERE user_id=$1 
          AND post_id=(SELECT id FROM post WHERE ref_string=$2)`;

    const queryParams = refComment ? [id, refComment] : [id, refPost];

    await db.query(query, queryParams, (error, result) => {
      if (!error && result.rowCount) {
        res.status(200).json({success: "Your vote was removed!", remove: true});
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  }

  if (req.session.userId) {
    if (refPost && refComment) {
      res.status(400).json({error: "You can only update one item at a time!"});
    } else {
      checkVoteAndModify(refPost, refComment, parseInt(vote), req.session.userId);
    }
  } else {
    res.status(401).json({error: "You need to be authenticated in order to vote!"});
  }
}