const db = require("../../database/query");
const marked = require("marked");
marked.setOptions({
  breaks: true,
  sanitize: true
});

module.exports = (mode) => {
  return (req, res) => {
    const {sort, page} = req.query;
    let data = {
      posts: [],
      communities: []
    };

    const getRelevantPosts = async (next) => {
      const query = req.session.userId ?
        `SELECT id, ref_string, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
          (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes,
          (CASE WHEN owner=$1 THEN true ELSE false END) AS owns, 
          (SELECT EXISTS(SELECT 1 FROM save_post WHERE user_id=$1 AND post_id=post.id)) AS saved,
          (SELECT vote FROM vote_post WHERE user_id=$1 AND post_id=post.id) as voted, 
          (SELECT username FROM users WHERE id=post.owner) as owner,
          TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited,
          deleted, title, link, content, type, flag 
          FROM post ORDER BY id DESC LIMIT 32`
        :
        `SELECT id, ref_string, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
          (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes, 
          (SELECT username FROM users WHERE id=post.owner) as owner, 
          TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited,
          deleted, title, link, content, type, flag 
          FROM post ORDER BY id ${"ASC"} OFFSET $1 LIMIT $2`;

      const queryParams = req.session.userId ? [req.session.userId] : [1, 3];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          result.rows.map(post => {
            if (!post.deleted) {
              data.posts.push({
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

          // this next is basically getRelevantCommunities
          if (mode === "render") {
            next(() => res.render("index", {logged: req.session.userId !== undefined, ...data}));
          } else {
            next(() => res.json({...data}));
          }
        } else {
          if (mode === "render") {
            return res.render("index", {logged: req.session.userId !== undefined, error: "Something went wrong!"});
          } else {
            return res.json({error: "Something went wrong!"});
          }
        }
      });
    }

    const getRelevantCommunities = async (next) => {
      const query = req.session.userId ?
        `SELECT id, name, meta FROM community ORDER BY id LIMIT 8`
        :
        `SELECT id, name, meta FROM community ORDER BY id LIMIT 8`;

      const queryParams = req.session.userId ? [] : [];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          result.rows.map(community => {
            data.communities.push({
              name: community.name,
              meta: community.meta,
              subscribed: "never"
            });
          });

          next();
        } else {

        }
      });
    }

    getRelevantPosts(getRelevantCommunities);
  }
}