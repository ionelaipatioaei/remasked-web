const Pool = require("pg").Pool;
const db = new Pool();

exports.c = (req, res) => {
  const name = req.params.name;
  let data = {};

  const getCommunityInfo = async (name, next) => {
    await db.query("SELECT id, created, createdby, meta FROM community WHERE name=$1", [name], (error, result) => {
      if (!error) {
        data = {
          created: result.rows[0].created,
          createdby: result.rows[0].createdby,
          meta: result.rows[0].meta,
        }

        // this next is basically getCommunityPosts
        next(result.rows[0].id, () => res.json(data));
      }
    });
  }

  const getCommunityPosts = async (communityId, next) => {
    const query = req.session.userId ?
      "SELECT id, ref_string, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes, (SELECT vote FROM vote_post WHERE user_id=$1 AND post_id=id) as voted, (SELECT username FROM users WHERE id=post.owner) as owner, owner AS owner_id, created, title, link, content, type, flag FROM post WHERE community=$2 LIMIT 16" :
      "SELECT id, ref_string, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes, (SELECT username FROM users WHERE id=post.owner) as owner, owner AS owner_id, created, title, link, content, type, flag FROM post WHERE community=$1 LIMIT 16";

    const queryParams = req.session.userId ? [req.session.userId, communityId] : [communityId];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        let posts = [];
        result.rows.map(post => {
          posts.push({
            owner: post.owner,
            created: post.created,
            type: post.type,
            flag: post.flag,
            title: post.title,
            link: post.link,
            content: post.content,
            commentsAmount: post.comments_amount,
            votes: post.votes ? post.votes : 0,
            voted: post.voted ? post.voted : 0,
            ref: post.ref_string
          });
        });
        data.posts = posts;
        next();
      }
    });
  }

  getCommunityInfo(name, getCommunityPosts);
}

exports.post = (req, res) => {
  const id = req.params.id;
  let data = {};

  const getPostInfo = async (ref, next) => {
    const query = req.session.userId ?
      "SELECT (SELECT username FROM users WHERE id=owner) AS owner, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, (SELECT name FROM community WHERE id=community) AS community, (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes, (SELECT vote FROM vote_post WHERE user_id=$1 AND post_id=id) as voted, created, title, link, content, type, flag FROM post WHERE ref_string=$2" :
      "SELECT (SELECT username FROM users WHERE id=owner) AS owner, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, (SELECT name FROM community WHERE id=community) AS community, (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes, created, title, link, content, type, flag FROM post WHERE ref_string=$1";
    const queryParams = req.session.userId ? [req.session.userId, ref] : [ref];

    await db.query(query, queryParams, (error, result) => {
      if (!error && result.rows.length) {
        data = {
          owner: result.rows[0].owner,
          created: result.rows[0].created,
          community: result.rows[0].community,
          title: result.rows[0].title,
          link: result.rows[0].link,
          content: result.rows[0].content,
          type: result.rows[0].type,
          flag: result.rows[0].flag,
          commentsAmount: result.rows[0].comments_amount,
          votes: result.rows[0].votes ? result.rows[0].votes : 0,
          voted: result.rows[0].voted ? result.rows[0].voted : 0,
          ref: ref
        };

        // this next is basically getPostComments
        next(ref, () => res.json(data));
      } else {
        res.json({error: "Post id invalid or something went wrong!"});
      }
    });
  }

  const getPostComments = async (ref, next) => {
    let comments = [];

    const query = req.session.userId ? 
      "SELECT id, ref_string, (SELECT username FROM users WHERE id=owner) AS owner, (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, (SELECT vote FROM vote_comment WHERE user_id=$1 AND comment_id=id) as voted, created, content, comment_parent AS parent FROM comment WHERE post_parent=(SELECT id FROM post WHERE ref_string=$2) ORDER BY id DESC" :
      "SELECT id, ref_string, (SELECT username FROM users WHERE id=owner) AS owner, (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, created, content, comment_parent AS parent FROM comment WHERE post_parent=(SELECT id FROM post WHERE ref_string=$1) ORDER BY id DESC";

    const queryParams = req.session.userId ? [req.session.userId, ref] : [ref];

    await db.query(query, queryParams, (error, result) => {
      if (!error && result.rows.length) {
        result.rows.map(comment => {
          if (!comment.parent) {

            const findChildren = id => {
              const childrenComments = [];
              result.rows.map(com => {
                if (com.parent === id) {
                  childrenComments.push({
                    owner: com.owner,
                    created: com.created,
                    content: com.content,
                    votes: com.votes ? com.votes : 0,
                    voted: com.voted ? com.voted : 0,
                    refPost: ref,
                    ref: com.ref_string,
                    children: findChildren(com.id)
                  });
                }
              });
              return childrenComments;
            }

            comments.push({
              owner: comment.owner,
              created: comment.created,
              content: comment.content,
              votes: comment.votes ? comment.votes : 0,
              voted: comment.voted ? comment.voted : 0,
              refPost: ref,
              ref: comment.ref_string,
              children: findChildren(comment.id)
            });
          }
        });
      }
      data.comments = comments;    
      next();
    });
  }

  getPostInfo(id, getPostComments);
}

exports.comment = (req, res) => {
  const {refPost, refComment, content} = req.body;
  // console.log(refPost, refComment, content);
  if (req.session.userId) {
    const query = refComment ?
      "INSERT INTO comment (owner, content, post_parent, comment_parent) VALUES ($1, $2, (SELECT id FROM post WHERE ref_string=$3), (SELECT id FROM comment WHERE ref_string=$4))" :
      "INSERT INTO comment (owner, content, post_parent, comment_parent) VALUES ($1, $2, (SELECT id FROM post WHERE ref_string=$3), NULL)";

    const queryParams = refComment ? [req.session.userId, content, refPost, refComment] : [req.session.userId, content, refPost];

    db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "You comment was registered!"});
      }
    });
  } else {
    res.json({error: "You need to have an account in order to comment!"});
  }
}

exports.vote = (req,res) => {
  const {refPost, refComment, vote} = req.body;

  const checkVoteAndModify = async (refPost, refComment, vote, id) => {
    const query = refComment ?
      "SELECT vote from vote_comment WHERE comment_id=(SELECT id FROM comment WHERE ref_string=$1) AND user_id=$2" :
      "SELECT vote from vote_post WHERE post_id=(SELECT id FROM post WHERE ref_string=$1) AND user_id=$2";

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
      "INSERT INTO vote_comment (user_id, comment_id, vote) VALUES ($1, (SELECT id FROM comment WHERE ref_string=$2), $3)" :
      "INSERT INTO vote_post (user_id, post_id, vote) VALUES ($1, (SELECT id FROM post WHERE ref_string=$2), $3)";

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
      "UPDATE vote_comment SET vote=$1 WHERE comment_id=(SELECT id FROM comment WHERE ref_string=$2) AND user_id=$3" :
      "UPDATE vote_post SET vote=$1 WHERE post_id=(SELECT id FROM post WHERE ref_string=$2) AND user_id=$3";

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
      "DELETE FROM vote_comment WHERE user_id=$1 AND comment_id=(SELECT id FROM comment WHERE ref_string=$2)" :
      "DELETE FROM vote_post WHERE user_id=$1 AND post_id=(SELECT id FROM post WHERE ref_string=$2)";

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