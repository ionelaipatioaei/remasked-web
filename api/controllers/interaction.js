const Pool = require("pg").Pool;
const db = new Pool();

exports.vote = (req,res) => {
  const {refPost, refComment, vote} = req.body;

  const checkVoteAndModify = async (refPost, refComment, vote, id) => {
    const query = refComment ?
      // comment
      `SELECT vote FROM vote_comment WHERE comment_id=(SELECT id FROM comment WHERE ref_string=$1) 
        AND user_id=$2` 
      :
      // post
      `SELECT vote FROM vote_post WHERE post_id=(SELECT id FROM post WHERE ref_string=$1) 
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
            res.json({error: "Wrong vote value!"});
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
            res.json({error: "Wrong vote value!"});
          }
        } 
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const addVote = async (refPost, refComment, vote, id) => {
    const query = refComment ?
      // comment
      `INSERT INTO vote_comment (user_id, comment_id, vote) 
        VALUES ($1, (SELECT id FROM comment WHERE ref_string=$2), $3)` 
      :
      // post
      `INSERT INTO vote_post (user_id, post_id, vote) 
        VALUES ($1, (SELECT id FROM post WHERE ref_string=$2), $3)`;

    const queryParams = refComment ? [id, refComment, vote] : [id, refPost, vote];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "Your vote was registered!"});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }
  
  const updateVote = async (refPost, refComment, vote, id) => {
    const query = refComment ?
      // comment
      `UPDATE vote_comment SET vote=$1 WHERE comment_id=(SELECT id FROM comment WHERE ref_string=$2) 
        AND user_id=$3` 
      :
      // post
      `UPDATE vote_post SET vote=$1 WHERE post_id=(SELECT id FROM post WHERE ref_string=$2) 
        AND user_id=$3`;

    const queryParams = refComment ? [vote, refComment, id] : [vote, refPost, id];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "Your vote was registered!"});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }
  
  const removeVote = async (refPost, refComment, id) => {
    const query = refComment ?
      // comment
      `DELETE FROM vote_comment WHERE user_id=$1 
        AND comment_id=(SELECT id FROM comment WHERE ref_string=$2)` 
      :
      // post
      `DELETE FROM vote_post WHERE user_id=$1 
        AND post_id=(SELECT id FROM post WHERE ref_string=$2)`;

    const queryParams = refComment ? [id, refComment] : [id, refPost];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "Your vote was removed!", remove: true});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  if (req.session.userId) {
    if (refPost && refComment) {
      res.json({error: "You can only update one item at a time!"});
    } else {
      checkVoteAndModify(refPost, refComment, parseInt(vote), req.session.userId);
    }
  } else {
    res.json({error: "You need an account in order to vote!"});
  }
}

exports.subscribe = (req, res) => {
  const {name} = req.body;

  const updateSubscriptionStatus = async (name, id) => {
    const query = `SELECT EXISTS(SELECT 1 FROM subscription WHERE user_id=$1 AND 
      community_id=(SELECT id FROM community WHERE name=$2))`;

    const queryParams = [id, name];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        if (result.rows[0].exists) {
          removeSubscription(name, id);
        } else {
          addSubscription(name, id);
        }
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const addSubscription = async (name, id) => {
    const query = `INSERT INTO subscription (user_id, community_id) 
      VALUES ($1, (SELECT id FROM community WHERE name=$2))`;

    const queryParams = [id, name];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: `You subscribed to ${name}!`});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const removeSubscription = async (name, id) => {
    const query = `DELETE FROM subscription WHERE user_id=$1 AND 
      community_id=(SELECT id FROM community WHERE name=$2)`;

    const queryParams = [id, name];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: `You unsubscribed from ${name}!`});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  if (req.session.userId) {
    if (name) {
      updateSubscriptionStatus(name, req.session.userId);
    } else {
      res.json({error: "The community name invalid!"});
    }
  } else {
    res.json({error: "You need an account in order to subscribe or unsubscribe!"});
  }
}

exports.save = (req, res) => {
  const {refPost, refComment} = req.body;

  const updateSavedPostsAndComments = async (refPost, refComment, id) => {
    const query = refComment ?
      `SELECT EXISTS(SELECT 1 FROM save_comment WHERE user_id=$1 AND 
        comment_id=(SELECT id FROM comment WHERE ref_string=$2))`
      :
      `SELECT EXISTS(SELECT 1 FROM save_post WHERE user_id=$1 AND 
        post_id=(SELECT id FROM post WHERE ref_string=$2))`;

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
        VALUES ($1, (SELECT id FROM comment WHERE ref_string=$2))` 
      :
      // post
      `INSERT INTO save_post (user_id, post_id) 
        VALUES ($1, (SELECT id FROM post WHERE ref_string=$2))`;

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
      `DELETE FROM save_comment WHERE user_id=$1 
        AND comment_id=(SELECT id FROM comment WHERE ref_string=$2)` 
      :
      // post
      `DELETE FROM save_post WHERE user_id=$1 
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