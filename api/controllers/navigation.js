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
      "SELECT id, ref_string, (SELECT username FROM users WHERE id=owner) AS owner, (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, (SELECT vote FROM vote_comment WHERE user_id=$1 AND comment_id=id) as voted, created, content, comment_parent AS parent FROM comment WHERE post_parent=(SELECT id FROM post WHERE ref_string=$2)" :
      "SELECT id, ref_string, (SELECT username FROM users WHERE id=owner) AS owner, (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, created, content, comment_parent AS parent FROM comment WHERE post_parent=(SELECT id FROM post WHERE ref_string=$1)";

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