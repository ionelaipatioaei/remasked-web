const db = require("../../database/query");
const pageSort = require("../../shared/pageSort");
const marked = require("marked");
marked.setOptions({
  breaks: true,
  sanitize: true
});

module.exports = (mode) => {
  return (req, res) => {
    const page = parseInt(req.query.page);
    const sort = req.query.sort ? req.query.sort.toLowerCase() : "";
    let data = {
      posts: [],
      communities: []
    };

    const getRelevantPosts = async (next) => {
      const ps = pageSort(page, sort);

      const query = req.session.userId ?
        `SELECT post.id, post.ref_string, post.title, post.link, post.content, post.type, post.flag, post.deleted, post.throwaway, post.hidden,
            (CASE WHEN post.owner=$1 THEN true ELSE false END) AS owns, 
            (SELECT vote FROM vote_post WHERE user_id=$1 AND post_id=post.id) as voted, 
            (SELECT EXISTS(SELECT 1 FROM save_post WHERE user_id=$1 AND post_id=post.id)) AS saved,
            COUNT(comment) AS comments_amount, 
            (SELECT username FROM users WHERE id=post.owner) as owner,
            (SELECT SUM(vote) FROM vote_post WHERE post_id=post.id) AS votes,
            TO_CHAR(post.created, 'DD/MM/YY at HH24:MI') AS created, 
            TO_CHAR(post.edited, 'DD/MM/YY at HH24:MI') AS edited,
            (SELECT name FROM community WHERE id=post.community) AS community
          FROM post 
          LEFT JOIN comment ON comment.post_parent=post.id
          GROUP BY post.id
          ORDER BY ${ps.sort} OFFSET $2 LIMIT $3`
        :
        `SELECT post.id, post.ref_string, post.title, post.link, post.content, post.type, post.flag, post.deleted, post.throwaway, post.hidden,
            COUNT(comment) AS comments_amount, 
            (SELECT username FROM users WHERE id=post.owner) as owner, 
            (SELECT SUM(vote) FROM vote_post WHERE post_id=post.id) AS votes, 
            TO_CHAR(post.created, 'DD/MM/YY at HH24:MI') AS created, 
            TO_CHAR(post.edited, 'DD/MM/YY at HH24:MI') AS edited,
            (SELECT name FROM community WHERE id=post.community) AS community
          FROM post 
          LEFT JOIN comment ON comment.post_parent=post.id
          GROUP BY post.id
          ORDER BY ${ps.sort} OFFSET $1 LIMIT $2`;

      const queryParams = req.session.userId ? [req.session.userId, ps.limits[0], ps.limits[1]] : [ps.limits[0], ps.limits[1]];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          result.rows.map(post => {
            // override the post.hidden when the user wants to see the removed posts
            if (!post.deleted && !post.hidden) {
              data.posts.push({
                community: post.community,
                owner: post.throwaway ? "" : post.owner,
                throwaway: post.throwaway,
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
          if (mode === "render") next(() => res.status(200).render("index", {logged: req.session.userId !== undefined, ...data}));
          else next(() => res.status(200).json({...data}));
        } else {
          if (mode === "render") return res.status(502).render("misc/error", {logged: req.session.userId !== undefined, error: 502});
          else return res.status(502).json({error: "Something went wrong!"});
        }
      });
    }

    const getRelevantCommunities = async (next) => {
      const query = req.session.userId ?
        `SELECT id, name, TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created 
          FROM community ORDER BY random() LIMIT 10`
        :
        `SELECT id, name, TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created 
          FROM community ORDER BY random() LIMIT 10`;

      const queryParams = req.session.userId ? [] : [];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          result.rows.map(community => {
            data.communities.push({
              name: community.name,
              created: community.created
            });
          });

          next();
        } else {
          if (mode === "render") return res.status(502).render("misc/error", {logged: req.session.userId !== undefined, error: 502});
          else return res.status(502).json({error: "Something went wrong!"});
        }
      });
    }

    getRelevantPosts(getRelevantCommunities);
  }
}