const db = require("../../database/query");
const cache = require("../../cache/query");
const marked = require("marked");
marked.setOptions({
  breaks: true,
  sanitize: true
});

const POST_CACHE_TTL = 30;

module.exports = (mode) => {
  return (req, res) => {
    const id = req.params.id;
    const cacheKey = `post:${id}:user:${req.session.userId}`;
    let data = {};

    const getPostInfo = async (ref, next) => {  
      const query = req.session.userId ?
        `SELECT id, ref_string, title, link, content, type, flag, deleted, throwaway, hidden,
            (CASE WHEN owner=$1 THEN true ELSE false END) AS owns,
            (SELECT vote FROM vote_post WHERE user_id=$1 AND post_id=id) as voted, 
            (SELECT EXISTS(SELECT 1 FROM save_post WHERE user_id=$1 AND post_id=post.id)) AS saved,
            (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
            (SELECT username FROM users WHERE id=owner) AS owner, 
            (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes,
            TO_CHAR(created, 'DD Mon YY at HH24:MI') AS created, 
            TO_CHAR(edited, 'DD Mon YY at HH24:MI') AS edited,
            (SELECT name FROM community WHERE id=community) AS community
          FROM post 
          WHERE ref_string=$2`
        :
        `SELECT id, ref_string, title, link, content, type, flag, deleted, throwaway, hidden,
            (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
            (SELECT username FROM users WHERE id=owner) AS owner, 
            (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes, 
            TO_CHAR(created, 'DD Mon YY at HH24:MI') AS created, 
            TO_CHAR(edited, 'DD Mon YY at HH24:MI') AS edited,
            (SELECT name FROM community WHERE id=community) AS community
          FROM post 
          WHERE ref_string=$1`;

      const queryParams = req.session.userId ? [req.session.userId, ref] : [ref];

      await db.query(query, queryParams, (error, result) => {
        if (!error && result.rows.length) {
          data = {
            owner: result.rows[0].throwaway ? "" : result.rows[0].owner,
            throwaway: result.rows[0].throwaway,
            created: result.rows[0].created,
            edited: result.rows[0].edited,
            deleted: result.rows[0].deleted,
            owns: result.rows[0].owns ? result.rows[0].owns : false,
            saved: result.rows[0].saved ? result.rows[0].saved : false,
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
          
          // this looks kinda bad I should do a refactor
          if (result.rows.length) {
            // this next is basically getPostComments
            if (mode === "render") next(ref, () => res.status(200).render("navigation/gen/post", {logged: req.session.userId !== undefined, ...data}));
            else next(ref, () => res.status(200).json(data));

          } else {
            if (mode === "render") res.status(404).render("misc/error", {logged: req.session.userId !== undefined});
            else res.status(404).json({error: "Something went wrong!"});
          }
        } else {
          if (mode === "render") res.status(502).render("misc/error", {logged: req.session.userId !== undefined, error: 502});
          else res.status(502).json({error: "Something went wrong!"});
        }
      });
    }

    const getPostComments = async (ref, next) => {
      let comments = [];

      const query = req.session.userId ?
        `SELECT id, ref_string, content, deleted, throwaway, hidden,
            (CASE WHEN owner=$1 THEN true ELSE false END) AS owns,
            (SELECT vote FROM vote_comment WHERE user_id=$1 AND comment_id=id) as voted, 
            (SELECT EXISTS(SELECT 1 FROM save_comment WHERE user_id=$1 AND comment_id=comment.id)) AS saved,
            (SELECT username FROM users WHERE id=owner) AS owner, 
            (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, 
            TO_CHAR(created, 'DD Mon YY at HH24:MI') AS created, 
            TO_CHAR(edited, 'DD Mon YY at HH24:MI') AS edited, 
            comment_parent AS parent
          FROM comment 
          WHERE post_parent=(SELECT id FROM post WHERE ref_string=$2) 
          ORDER BY id DESC` 
        :
        `SELECT id, ref_string, content, deleted, throwaway, hidden,
            (SELECT username FROM users WHERE id=owner) AS owner, 
            (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, 
            TO_CHAR(created, 'DD Mon YY at HH24:MI') AS created, 
            TO_CHAR(edited, 'DD Mon YY at HH24:MI') AS edited,
            comment_parent AS parent
          FROM comment 
          WHERE post_parent=(SELECT id FROM post WHERE ref_string=$1) 
          ORDER BY id DESC`;

      const queryParams = req.session.userId ? [req.session.userId, ref] : [ref];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          result.rows.map(comment => {
            if (!comment.parent) {

              const findChildren = id => {
                const childrenComments = [];
                result.rows.map(com => {
                  if (com.parent === id) {
                    childrenComments.push({
                      owner: com.throwaway ? "" : com.owner,
                      throwaway: com.throwaway,
                      owns: com.owns ? com.owns : false,
                      saved: com.saved ? com.saved : false,
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
                owner: comment.throwaway ? "" : comment.owner,
                throwaway: comment.throwaway,
                owns: comment.owns ? comment.owns : false,
                saved: comment.saved ? comment.saved : false,
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
        } else {
          if (mode === "render") res.status(502).render("misc/error", {logged: req.session.userId !== undefined, error: 502});
          else res.status(502).json({error: "Something went wrong!"});
        }
        data.comments = comments;
        cache.setex(cacheKey, POST_CACHE_TTL, JSON.stringify(data));
        next();
      });
    }

    cache.get(cacheKey, (error, cachedData) => {
      if (!error) {
        // cache only unauthenticated requests
        if (cachedData && cacheKey === `post:${id}:user:${undefined}`) {
          if (mode === "render") return res.status(200).render("navigation/gen/post", {logged: req.session.userId !== undefined, ...JSON.parse(cachedData)});
          else return res.status(200).json(JSON.parse(cachedData));
        } else {
          getPostInfo(id, getPostComments);
        }
      } else {
        if (mode === "render") return res.status(502).render("misc/error", {logged: req.session.userId !== undefined, error: 502});
        else return res.status(502).json({error: "Something went wrong!"});
      }
    });
  }
}