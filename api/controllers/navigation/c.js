const db = require("../../database/query");
const marked = require("marked");
marked.setOptions({
  breaks: true,
  sanitize: true
});

module.exports = (mode) => {
  return (req, res) => {
    const name = req.params.name;
    let data = {};

    const getCommunityInfo = async (name, next) => {
      // id, created, createdby, owns, subscribed, meta
      const query = req.session.userId ? 
        `SELECT id, TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created,
          (SELECT COUNT(*) FROM subscription WHERE community_id=(SELECT id FROM community WHERE name=$1)) AS subscribers, 
          (SELECT username FROM users WHERE id=createdby) AS createdby, (CASE WHEN createdby=$2 THEN true ELSE false END) AS owns, 
          (SELECT EXISTS(SELECT 1 FROM subscription WHERE user_id=$2 AND community_id=id)) AS subscribed, meta 
          FROM community WHERE name=$1`
        :
        // id, created, createdby, -, -, meta
        `SELECT id, TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created,
          (SELECT COUNT(*) FROM subscription WHERE community_id=(SELECT id FROM community WHERE name=$1)) AS subscribers, 
          (SELECT username FROM users WHERE id=createdby) AS createdby, meta 
          FROM community WHERE name=$1`;

      const queryParams = req.session.userId ? [name, req.session.userId] : [name];

      await db.query(query, queryParams, (error, result) => {
        if (!error && result.rows.length) {
          data = {
            subscribers: result.rows[0].subscribers,
            created: result.rows[0].created,
            createdby: result.rows[0].createdby,
            owns: result.rows[0].owns ? result.rows[0].owns : false,
            subscribed: result.rows[0].subscribed ? result.rows[0].subscribed : false,
            metaRaw: result.rows[0].meta,
            meta: marked(result.rows[0].meta),
          }

          // this next is basically getCommunityPosts
          if (mode === "render") {
            next(result.rows[0].id, () => res.render("navigation/gen/c", {logged: req.session.userId !== undefined, name: name, ...data}));
          } else {
            next(result.rows[0].id, () => res.json(data));
          }
        } else {
          if (mode === "render") {
            res.render("misc/notFound", {logged: req.session.userId !== undefined});
          } else {
            res.json({error: "Something went wrong!"});
          }
        }
      });
    }

    const getCommunityPosts = async (communityId, next) => {
      const query = req.session.userId ?
        // id, ref, c_amount, votes, owns, saved, voted, owner, created, edited, deleted, title, link, content, type, flag
        `SELECT id, ref_string, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
          (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes,
          (CASE WHEN owner=$1 THEN true ELSE false END) AS owns, 
          (SELECT EXISTS(SELECT 1 FROM save_post WHERE user_id=$1 AND post_id=post.id)) AS saved,
          (SELECT vote FROM vote_post WHERE user_id=$1 AND post_id=post.id) as voted, 
          (SELECT username FROM users WHERE id=post.owner) as owner,
          TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited,
          deleted, title, link, content, type, flag 
          FROM post WHERE community=$2 ORDER BY id LIMIT 32`
        :
        // id, ref, c_amount, votes, -, -, -, owner, created, edited, deleted, title, link, content, type, flag
        `SELECT id, ref_string, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
          (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes, 
          (SELECT username FROM users WHERE id=post.owner) as owner, 
          TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited,
          deleted, title, link, content, type, flag 
          FROM post WHERE community=$1 ORDER BY id LIMIT 32`;

      const queryParams = req.session.userId ? [req.session.userId, communityId] : [communityId];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          let posts = [];
          result.rows.map(post => {
            if (!post.deleted) {
              posts.push({
                owner: post.owner,
                created: post.created,
                edited: post.edited,
                deleted: post.deleted,
                owns: post.owns ? post.owns : false,
                saved:  post.saved ? post.saved : false,
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
            }
          });
          data.posts = posts;
          next();
        } else {
          if (mode === "render") {
            res.render("misc/notFound", {logged: req.session.userId !== undefined});
          } else {
            res.json({error: "Something went wrong!"});
          }
        }
      });
    }

    getCommunityInfo(name, getCommunityPosts);
  }
}
