const marked = require("marked");
marked.setOptions({
  breaks: true,
  sanitize: true
});
const Pool = require("pg").Pool;
const db = new Pool();

exports.c = (mode) => {
  return (req, res) => {
    const name = req.params.name;
    let data = {};

    const getCommunityInfo = async (name, next) => {
      // id, created, createdby, meta
      const query = `SELECT id, TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created,
        (SELECT COUNT(*) FROM subscription WHERE community_id=(SELECT id FROM community WHERE name=$1)) AS subscribers, 
        (SELECT username FROM users WHERE id=createdby) AS createdby, meta 
        FROM community WHERE name=$1`;

      const queryParams = [name];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          data = {
            subscribers: result.rows[0].subscribers,
            created: result.rows[0].created,
            createdby: result.rows[0].createdby,
            meta: marked(result.rows[0].meta),
          }

          // this next is basically getCommunityPosts
          if (mode === "render") {
            next(result.rows[0].id, () => res.render("navigation/gen/c", {logged: req.session.userId !== undefined, name: name, ...data}));
          } else {
            next(result.rows[0].id, () => res.json(data));
          }
        }
      });
    }

    const getCommunityPosts = async (communityId, next) => {
      const query = req.session.userId ?
        // id, ref, c_amount, votes, owns, voted, owner, owner_id, created, title, link, content, type, flag
        `SELECT id, ref_string, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
          (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes,
          (CASE WHEN owner=$1 THEN true ELSE false END) AS owns,
          (SELECT vote FROM vote_post WHERE user_id=$1 AND post_id=id) as voted, 
          (SELECT username FROM users WHERE id=post.owner) as owner, owner AS owner_id, 
          TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, title, link, content, type, flag 
          FROM post WHERE community=$2 LIMIT 32`
        :
        // id, ref, c_amount, votes, -, -, owner, owner_id, created, title, link, content, type, flag
        `SELECT id, ref_string, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
          (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes, 
          (SELECT username FROM users WHERE id=post.owner) as owner, owner AS owner_id, 
          TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, title, link, content, type, flag 
          FROM post WHERE community=$1 LIMIT 32`;

      const queryParams = req.session.userId ? [req.session.userId, communityId] : [communityId];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          let posts = [];
          result.rows.map(post => {
            posts.push({
              owner: post.owner,
              created: post.created,
              owns: post.owns ? post.owns : false,
              type: post.type,
              flag: post.flag,
              title: post.title,
              link: post.link,
              contentRaw: post.content,
              content: post.content ? marked(post.content) : null,
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
}

exports.post = (mode) => {
  return (req, res) => {
    const id = req.params.id;
    let data = {};

    const getPostInfo = async (ref, next) => {
      const query = req.session.userId ?
        // owner, c_amount, community, votes, owns, voted, created, title, link, content, type, flag
        `SELECT (SELECT username FROM users WHERE id=owner) AS owner, 
          (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
          (SELECT name FROM community WHERE id=community) AS community, 
          (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes,
          (CASE WHEN owner=$1 THEN true ELSE false END) AS owns,
          (SELECT vote FROM vote_post WHERE user_id=$1 AND post_id=id) as voted, 
          TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, title, link, content, type, flag 
          FROM post WHERE ref_string=$2`
        :
        // owner, c_amount, community, votes, -, created, title, link, content, type, flag
        `SELECT (SELECT username FROM users WHERE id=owner) AS owner, 
          (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
          (SELECT name FROM community WHERE id=community) AS community, 
          (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes, 
          TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, title, link, content, type, flag 
          FROM post WHERE ref_string=$1`;

      const queryParams = req.session.userId ? [req.session.userId, ref] : [ref];

      await db.query(query, queryParams, (error, result) => {
        if (!error && result.rows.length) {
          data = {
            owner: result.rows[0].owner,
            created: result.rows[0].created,
            owns: result.rows[0].owns ? result.rows[0].created : false,
            community: result.rows[0].community,
            title: result.rows[0].title,
            link: result.rows[0].link,
            contentRaw: result.rows[0].content,
            content: result.rows[0].content ? marked(result.rows[0].content) : null,
            type: result.rows[0].type,
            flag: result.rows[0].flag,
            commentsAmount: result.rows[0].comments_amount,
            votes: result.rows[0].votes ? result.rows[0].votes : 0,
            voted: result.rows[0].voted ? result.rows[0].voted : 0,
            ref: ref
          };

          // this next is basically getPostComments
          if (mode === "render") {
            next(ref, () => res.render("navigation/gen/post", {logged: req.session.userId !== undefined, name: req.params.name, ...data}));
          } else {
            next(ref, () => res.json(data));
          }

        } else {
          res.json({error: "Post id invalid or something went wrong!"});
        }
      });
    }

    const getPostComments = async (ref, next) => {
      let comments = [];

      const query = req.session.userId ?
        // id, ref, owner, votes, owns, voted, created, edited, deleted, content, parent
        `SELECT id, ref_string, (SELECT username FROM users WHERE id=owner) AS owner, 
          (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, 
          (CASE WHEN owner=$1 THEN true ELSE false END) AS owns, 
          (SELECT vote FROM vote_comment WHERE user_id=$1 AND comment_id=id) as voted, 
          TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited, 
          deleted, content, comment_parent AS parent 
          FROM comment WHERE post_parent=(SELECT id FROM post WHERE ref_string=$2) ORDER BY id DESC` 
        :
        // id, ref, owner, votes, -, -, created, edited, deleted, content, parent
        `SELECT id, ref_string, (SELECT username FROM users WHERE id=owner) AS owner, 
          (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, 
          TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited,
          deleted, content, comment_parent AS parent 
          FROM comment WHERE post_parent=(SELECT id FROM post WHERE ref_string=$1) ORDER BY id DESC`;

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
                      owns: com.owns ? com.owns : false,
                      created: com.created,
                      edited: com.edited,
                      deleted: com.deleted,
                      contentRaw: com.content,
                      content: com.content ? marked(com.content) : null,
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
                owns: comment.owns ? comment.owns : false,
                created: comment.created,
                edited: comment.edited,
                deleted: comment.deleted,
                contentRaw: comment.content,
                content: comment.content ? marked(comment.content) : null,
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
}