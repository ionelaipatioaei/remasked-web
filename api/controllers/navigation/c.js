const db = require("../../database/query");
const cache = require("../../cache/query");
const pageSort = require("../../shared/pageSort");
const marked = require("marked");
marked.setOptions({
  breaks: true,
  sanitize: true
});

const C_CACHE_TTL = 20;

module.exports = (mode) => {
  return (req, res) => {
    const name = req.params.name.toLowerCase();
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const sort = req.query.sort ? req.query.sort.toLowerCase() : "popular";
    const cacheKey = `c:${name}:${page}:${sort}:user:${req.session.userId}`;
    let data = {};

    const getCommunityInfo = async (name, next) => {
      // the way I select subscribers is stupid
      const query = req.session.userId ? 
        `SELECT 
            id, name,
            TO_CHAR(created, 'DD Mon YY at HH24:MI') AS created,
            (SELECT COUNT(*) FROM subscription WHERE community_id=(SELECT id FROM community WHERE name=$1)) AS subscribers, 
            (SELECT username FROM users WHERE id=createdby) AS createdby, 
            (CASE WHEN createdby=$2 THEN true ELSE false END) AS owns, 
            (SELECT EXISTS(SELECT 1 FROM subscription WHERE user_id=$2 AND community_id=id)) AS subscribed, 
            meta 
          FROM community 
          WHERE unique_name=$1`
        :
        `SELECT 
            id, name, TO_CHAR(created, 'DD Mon YY at HH24:MI') AS created,
            (SELECT COUNT(*) FROM subscription WHERE community_id=(SELECT id FROM community WHERE name=$1)) AS subscribers, 
            (SELECT username FROM users WHERE id=createdby) AS createdby, 
            meta 
          FROM community 
          WHERE unique_name=$1`;

      const queryParams = req.session.userId ? [name, req.session.userId] : [name];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          if (result.rows.length) {
            data = {
              name: result.rows[0].name,
              subscribers: result.rows[0].subscribers,
              created: result.rows[0].created,
              createdby: result.rows[0].createdby,
              // this is needed because idk
              noFounder: result.rows[0].createdby ? false : true,
              owns: result.rows[0].owns ? result.rows[0].owns : false,
              subscribed: result.rows[0].subscribed ? result.rows[0].subscribed : false,
              metaRaw: result.rows[0].meta,
              meta: marked(result.rows[0].meta),
            };

            // this next is basically getCommunityPosts
            if (mode === "render") next(result.rows[0].id, result.rows[0].name, () => res.status(200).render("navigation/gen/c", {logged: req.session.userId !== undefined, name: name, ...data}));
            else next(result.rows[0].id, result.rows[0].name, () => res.status(200).json(data));
          } else {
            if (mode === "render") res.status(404).render("misc/error", {logged: req.session.userId !== undefined});
            else res.status(404).json({error: "We couldn't find what you are looking for!"});
          }

        } else {
          if (mode === "render") res.status(502).render("misc/error", {logged: req.session.userId !== undefined, error: 502});
          else res.status(502).json({error: "Something went wrong!"});
        }
      });
    }

    const getCommunityPosts = async (communityId, communityName, next) => {
      const ps = pageSort(page, sort);

      const query = req.session.userId ?
        // because when a post is deleted the community is set to null
        // there is no reason to select the deleted column
        `SELECT post.id, post.ref_string, post.title, post.link, post.content, post.type, post.flag, post.throwaway, post.hidden,
            (CASE WHEN post.owner=$1 THEN true ELSE false END) AS owns, 
            (SELECT vote FROM vote_post WHERE user_id=$1 AND post_id=post.id) as voted, 
            (SELECT EXISTS(SELECT 1 FROM save_post WHERE user_id=$1 AND post_id=post.id)) AS saved,
            COUNT(comment) AS comments_amount, 
            (SELECT username FROM users WHERE id=post.owner) as owner,
            (SELECT SUM(vote) FROM vote_post WHERE post_id=post.id) AS votes,
            TO_CHAR(post.created, 'DD Mon YY at HH24:MI') AS created, 
            TO_CHAR(post.edited, 'DD Mon YY at HH24:MI') AS edited
          FROM post
          LEFT JOIN comment ON comment.post_parent=post.id
          WHERE community=$2
          GROUP BY post.id
          ORDER BY ${ps.sort} OFFSET $3 LIMIT $4`
        :
        `SELECT post.id, post.ref_string, post.title, post.link, post.content, post.type, post.flag, post.throwaway, post.hidden,
            COUNT(comment) AS comments_amount, 
            (SELECT username FROM users WHERE id=post.owner) as owner, 
            (SELECT SUM(vote) FROM vote_post WHERE post_id=post.id) AS votes, 
            TO_CHAR(post.created, 'DD Mon YY at HH24:MI') AS created, 
            TO_CHAR(post.edited, 'DD Mon YY at HH24:MI') AS edited
          FROM post 
          LEFT JOIN comment ON comment.post_parent=post.id
          WHERE community=$1 
          GROUP BY post.id
          ORDER BY ${ps.sort} OFFSET $2 LIMIT $3`;

      const queryParams = req.session.userId ? [req.session.userId, communityId, ps.limits[0], ps.limits[1]] : [communityId, ps.limits[0], ps.limits[1]];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          let posts = [];
          result.rows.map(post => {
            // override the post.hidden when the user wants to see the removed posts
            // no need to check id deleted because a deleted post is not even selected
            if (!post.hidden) {
              posts.push({
                community: communityName,
                owner: post.throwaway ? "" : post.owner,
                throwaway: post.throwaway,
                created: post.created,
                edited: post.edited,
                // always false because that was true it wouldn't even be selected
                deleted: false,
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
          cache.setex(cacheKey, C_CACHE_TTL, JSON.stringify(data));
          next();
        } else {
          if (mode === "render") res.status(502).render("misc/error", {logged: req.session.userId !== undefined, error: 502});
          else res.status(502).json({error: "Something went wrong!"});
        }
      });
    }

    cache.get(cacheKey, (error, cachedData) => {
      if (!error) {
        if (cachedData) {
          if (mode === "render") return res.status(200).render("navigation/gen/c", {logged: req.session.userId !== undefined, name: name, ...JSON.parse(cachedData)});
          else return res.status(200).json(JSON.parse(cachedData));
        } else {
          getCommunityInfo(name, getCommunityPosts);
        }
      } else {
        if (mode === "render") return res.status(502).render("misc/error", {logged: req.session.userId !== undefined, error: 502});
        else return res.status(502).json({error: "Something went wrong!"});
      }
    });
  }
}
