const db = require("../../database/query");
const marked = require("marked");
marked.setOptions({
  breaks: true,
  sanitize: true
});
const getProfileQuery = require("../../shared/getProfileQuery");

module.exports = (mode) => {
  return (req, res) => {
    const name = req.params.name;
    const type = req.query.type;
    let data = {};

    const getProfileInfo = async (ownProfile, username, type, next) => {
      const query = ownProfile ? 
        `SELECT username, TO_CHAR(created, 'DD Mon YY') AS created, 
            (SELECT SUM(vote) FROM vote_post WHERE user_id=$1) AS post_points,
            (SELECT SUM(vote) FROM vote_comment WHERE user_id=$1) AS comment_points,
            (SELECT COUNT(*) FROM post WHERE owner=$1) AS posts_amount,
            (SELECT COUNT(*) FROM comment WHERE owner=$1) AS comments_amount
          FROM users WHERE id=$1`
        :
        `SELECT username, TO_CHAR(created, 'DD Mon YY') AS created, users.id AS user_id,
            (SELECT SUM(vote) FROM vote_post WHERE user_id=users.id) AS post_points,
            (SELECT SUM(vote) FROM vote_comment WHERE user_id=users.id) AS comment_points,
            (SELECT COUNT(*) FROM post WHERE owner=users.id) AS posts_amount,
            (SELECT COUNT(*) FROM comment WHERE owner=users.id) AS comments_amount
          FROM users WHERE id=(SELECT id FROM users WHERE unique_name=$1)`;

      const queryParams = ownProfile ? [req.session.userId] : [username.toLowerCase()];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          // we do this in order to differentiate between a 404 and a 502
          // technically no difference if we combined it with the !error tho
          if (result.rows.length) {
            data = {
              username: result.rows[0].username,
              created: result.rows[0].created,
              postPoints: parseInt(result.rows[0].post_points),
              commentPoints: parseInt(result.rows[0].comment_points),
              postsAmount: parseInt(result.rows[0].posts_amount),
              commentsAmount: parseInt(result.rows[0].comments_amount)
            };
            // this next is basically getProfileData
            // need to refactor this mess
            if (mode === "render") next(data.username, type, result.rows[0].user_id, () => res.status(200).render("navigation/profile", {logged: req.session.userId !== undefined, own: username ? (req.session.userId === result.rows[0].user_id) : ownProfile, ...data}));
            else next(data.username, type, result.rows[0].user_id, () => res.status(200).json(data));
          } else {
            if (mode === "render") res.status(404).render("misc/error", {logged: req.session.userId !== undefined});
            else res.status(404).json({error: "We couldn't find the profile!"});
          }
        } else {
          if (mode === "render") res.status(502).render("misc/error", {logged: req.session.userId !== undefined, error: 502});
          else res.status(502).json({error: "Something went wrong!"});
        }
      });
    }

    // like posts, comments and for logged users also saved posts and saved comments
    const getProfileData = async (username, type, currentId, next) => {
      let query = "";
      let queryParams = [username.toLowerCase()];
      // pc stands for p - posts or c - comments
      let pcData = [];
      // this is the default option
      let dataType = "posts";

      // this is one of the worse things on this project
      // I need to refactor this but it's 'ok' for now
      switch (type) {
        case "posts":
          query = getProfileQuery("posts", req.session.userId);
          if (req.session.userId) queryParams.push(req.session.userId);
          dataType = "posts";
          break;
          
          case "comments":
          query = getProfileQuery("comments", req.session.userId);
          if (req.session.userId) queryParams.push(req.session.userId);
          dataType = "comments";
          break;

        case "saved-posts":
          query = getProfileQuery("saved-posts", req.session.userId, currentId);
          if (!query) {
            if (mode === "render") return res.status(403).render("navigation/profile", {logged: req.session.userId !== undefined, ...data, error: 403});
            else return res.status(403).json({...data, error: 403});
          } else {
            queryParams = [req.session.userId];
          }
          dataType = "saved-posts";
          break;

        case "saved-comments":
          query = getProfileQuery("saved-comments", req.session.userId, currentId);
          if (!query) {
            if (mode === "render") return res.status(403).render("navigation/profile", {logged: req.session.userId !== undefined, ...data, error: 403});
            else return res.status(403).json({...data, error: 403});
          } else {
            queryParams = [req.session.userId];
          }
          dataType = "saved-comments";
          break;

        // if query doesn't match the 4 types show not found page or api error
        default:
          if (mode === "render") return res.status(400).render("misc/error", {logged: req.session.userId !== undefined});
          else return res.status(400).json({error: "Invalid request data!"});
          // no need for break; because of the above returns
      }

      const pushPostOrComment = (data, type) => {
        if (type === "posts" || type === "saved-posts") {
          pcData.push({
            owner: data.throwaway ? "" : data.owner,
            throwaway: data.throwaway,
            created: data.created,
            community: data.community,
            edited: data.edited,
            deleted: data.deleted,
            owns: data.owns ? data.owns : false,
            saved:  data.saved ? data.saved : false,
            type: data.type,
            flag: data.flag,
            title: data.title,
            link: data.link,
            contentRaw: data.content,
            content: data.content ? marked(data.content) : null,
            commentsAmount: data.comments_amount,
            votes: data.votes ? data.votes : 0,
            voted: data.voted ? data.voted : 0,
            ref: data.ref_string
          });
        } else {
          pcData.push({
            owner: data.throwaway ? "" : data.owner,
            throwaway: data.throwaway,
            owns: data.owns ? data.owns : false,
            saved: data.saved ? data.saved : false,
            created: data.created,
            edited: data.edited,
            deleted: data.deleted,
            contentRaw: data.content,
            content: data.content ? marked(data.content) : null,
            votes: data.votes ? data.votes : 0,
            voted: data.voted ? data.voted : 0,
            refPost: data.parent,
            ref: data.ref_string
          });
        }
      }

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          // check to see if there are any results
          // btw this is another piece of crap which should be refactored but oh well...
          if (result.rows.length) {

            for (let i = 0; i < result.rows.length; i++) {
              if (!result.rows[i].deleted && !result.rows[i].hidden && !result.rows[i].throwaway) {
                pushPostOrComment(result.rows[i], dataType);
              } else if (result.rows[i].throwaway && result.rows[i].owns) {
                pushPostOrComment(result.rows[i], dataType);
              }
            }

          } else {
            pcData = [];
          }
        } else {
          if (mode === "render") res.status(502).render("misc/error", {logged: req.session.userId !== undefined, error: 502});
          else res.status(502).json({error: "Something went wrong!"});
        }
        
        // kinda hacky but it does get the job done
        if (dataType === "posts") data.posts = pcData;
        else if (dataType === "comments") data.comments = pcData;
        else if (dataType === "saved-posts") data.savedPosts = pcData;
        else if (dataType === "saved-comments") data.savedComments = pcData;
        // because dataType is internal there can only be 4 cases, 
        // in case the user enters a wrong type it's caught before it reaches this
        next();
      });
    }

    if (req.session.userId && !name) {
      // if no type is specified make it the default to posts
      getProfileInfo(true, null, !type ? "posts" : type, getProfileData);
    } else if (name) {
      getProfileInfo(false, name, !type ? "posts" : type, getProfileData);
    // the only case left is (!name)
    } else {
      if (mode === "render") return res.status(401).render("navigation/profile", {logged: req.session.userId !== undefined, own: true, error: "You need to be authenticated in order to view you own profile!"});
      else return res.status(401).json({error: "You need to be authenticated in order to view you own profile!"});
    }
  }
}