const db = require("../../database/query");
const marked = require("marked");
marked.setOptions({
  breaks: true,
  sanitize: true
});

module.exports = (mode) => {
  return (req, res) => {
    const name = req.params.name;
    const type = req.query.type;
    let data = {};

    const getProfileInfo = async (ownProfile, username, type, next) => {
      const query = ownProfile ? 
        // username, created, p_points, c_points, p_amount, c_amount
        `SELECT username, TO_CHAR(created, 'DD/MM/YY') AS created, 
          (SELECT SUM(vote) FROM vote_post WHERE user_id=$1) AS post_points,
          (SELECT SUM(vote) FROM vote_comment WHERE user_id=$1) AS comment_points,
          (SELECT COUNT(*) FROM post WHERE owner=$1) AS posts_amount,
          (SELECT COUNT(*) FROM comment WHERE owner=$1) AS comments_amount
          FROM users WHERE id=$1`
          :
        // username, created, p_points, c_points, p_amount, c_amount
        `SELECT username, TO_CHAR(created, 'DD/MM/YY') AS created, (SELECT id FROM users WHERE username=$1) AS user_id, 
          (SELECT SUM(vote) FROM vote_post WHERE user_id=(SELECT id FROM users WHERE username=$1)) AS post_points,
          (SELECT SUM(vote) FROM vote_comment WHERE user_id=(SELECT id FROM users WHERE username=$1)) AS comment_points,
          (SELECT COUNT(*) FROM post WHERE owner=(SELECT id FROM users WHERE username=$1)) AS posts_amount,
          (SELECT COUNT(*) FROM comment WHERE owner=(SELECT id FROM users WHERE username=$1)) AS comments_amount
          FROM users WHERE id=(SELECT id FROM users WHERE username=$1)`;

      const queryParams = ownProfile ? [req.session.userId] : [username];

      await db.query(query, queryParams, (error, result) => {
        if (!error && result.rows.length) {
          data = {
            username: result.rows[0].username,
            created: result.rows[0].created,
            postPoints: result.rows[0].post_points,
            commentPoints: result.rows[0].comment_points,
            postsAmount: result.rows[0].posts_amount,
            commentsAmount: result.rows[0].comments_amount,
          };
          // this next is basically getProfileData
          if (mode === "render") {
            next(data.username, type, result.rows[0].user_id, () => res.render("navigation/profile", {logged: req.session.userId !== undefined, own: username ? (req.session.userId === result.rows[0].user_id) : ownProfile, ...data}));
          } else {
            next(data.username, type, result.rows[0].user_id, () => res.json(data));
          }
        } else {
          if (mode === "render") {
            res.render("misc/notFound", {logged: req.session.userId !== undefined});
          } else {
            res.json({error: "Something went wrong1!"});
          }
        }
      });
    }

    // like posts, comments and for logged users also saved posts and saved comments
    const getProfileData = async (username, type, currentId, next) => {
      let query = "";
      let queryParams = [username];
      // pc stands for p - posts or c - comments
      let pcData = [];
      // this is the default option
      let dataType = "posts";

      switch (type) {
        case "posts":
          query = req.session.userId ?
            // id, ref, c_amount, votes, owns, saved, voted, owner, created, edited, deleted, title, link, content, type, flag
            `SELECT id, ref_string, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
              (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes,
              (CASE WHEN owner=(SELECT id FROM users WHERE username=$1) THEN true ELSE false END) AS owns, 
              (SELECT EXISTS(SELECT 1 FROM save_post WHERE user_id=(SELECT id FROM users WHERE username=$1) AND post_id=post.id)) AS saved,
              (SELECT vote FROM vote_post WHERE user_id=(SELECT id FROM users WHERE username=$1) AND post_id=post.id) as voted, 
              (SELECT username FROM users WHERE id=post.owner) as owner,
              TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited,
              deleted, title, link, content, type, flag 
              FROM post WHERE owner=(SELECT id FROM users WHERE username=$1) ORDER BY id DESC LIMIT 32`
            :
            // id, ref, c_amount, votes, -, -, -, owner, created, edited, deleted, title, link, content, type, flag
            `SELECT id, ref_string, (SELECT name FROM community WHERE id=community) AS community, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
              (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes, 
              (SELECT username FROM users WHERE id=post.owner) as owner,
              TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited,
              deleted, title, link, content, type, flag 
              FROM post WHERE owner=(SELECT id FROM users WHERE username=$1) ORDER BY id DESC LIMIT 32;`;
          dataType = "posts";
          break;

        case "comments":
          query = req.session.userId ?
            `SELECT id, ref_string, (SELECT username FROM users WHERE id=owner) AS owner, 
              (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, 
              (CASE WHEN owner=(SELECT id FROM users WHERE username=$1) THEN true ELSE false END) AS owns,
              (SELECT EXISTS(SELECT 1 FROM save_comment WHERE user_id=(SELECT id FROM users WHERE username=$1) AND comment_id=comment.id)) AS saved,
              (SELECT vote FROM vote_comment WHERE user_id=(SELECT id FROM users WHERE username=$1) AND comment_id=id) as voted, 
              TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited, 
              deleted, content, (SELECT ref_string FROM post WHERE id=post_parent) AS parent 
              FROM comment WHERE owner=(SELECT id FROM users WHERE username=$1) ORDER BY id DESC`
            :
            `SELECT id, ref_string, (SELECT username FROM users WHERE id=owner) AS owner, 
              (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, 
              TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited,
              deleted, content, (SELECT ref_string FROM post WHERE id=post_parent) AS parent 
              FROM comment WHERE owner=(SELECT id FROM users WHERE username=$1) ORDER BY id DESC`;
          dataType = "comments";
          break;

        case "saved-posts":
          if (req.session.userId === currentId) {
            query = `SELECT id, ref_string, (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
              (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes,
              (CASE WHEN owner=$1 THEN true ELSE false END) AS owns, 
              (SELECT EXISTS(SELECT 1 FROM save_post WHERE user_id=$1 AND post_id=post.id)) AS saved,
              (SELECT vote FROM vote_post WHERE user_id=$1 AND post_id=post.id) as voted, 
              (SELECT username FROM users WHERE id=post.owner) as owner,
              TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited,
              deleted, title, link, content, type, flag 
              FROM post WHERE id=(SELECT post_id FROM save_post WHERE user_id=$1 AND post_id=id) AND owner=$1 ORDER BY id DESC LIMIT 32`;
            queryParams = [req.session.userId];
          } else {
            if (mode === "render") {
              return res.render("navigation/profile", {logged: req.session.userId !== undefined, ...data, error: "You can't view saved posts if you don't have an account!"});
            } else {
              return res.json({...data, error: "You can't view saved posts if you don't have an account!"});
            }
          }
          dataType = "saved-posts";
          break;

        case "saved-comments":
          if (req.session.userId === currentId) {
            query = `SELECT id, ref_string, (SELECT username FROM users WHERE id=owner) AS owner, 
              (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, 
              (CASE WHEN owner=$1 THEN true ELSE false END) AS owns,
              (SELECT EXISTS(SELECT 1 FROM save_comment WHERE user_id=$1 AND comment_id=comment.id)) AS saved,
              (SELECT vote FROM vote_comment WHERE user_id=$1 AND comment_id=id) as voted, 
              TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited, 
              deleted, content, (SELECT ref_string FROM post WHERE id=post_parent) AS parent 
              FROM comment WHERE id=(SELECT comment_id FROM save_comment WHERE user_id=$1 AND comment_id=id) AND owner=$1 ORDER BY id DESC`;
            queryParams = [req.session.userId];
          } else {
            if (mode === "render") {
              return res.render("navigation/profile", {logged: req.session.userId !== undefined, ...data, error: "You can't view saved comments if you don't have an account!"});
            } else {
              return res.json({...data, error: "You can't view saved comments if you don't have an account!"});
            }
          }
          dataType = "saved-comments";
          break;

        // if query doesn't match the 4 types show not found page or api error
        default:
          if (mode === "render") {
            return res.render("misc/notFound", {logged: req.session.userId !== undefined});
          } else {
            return res.json({error: "Invalid type!"});
          }
        // no need for break; because of the above returns
      }

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          // check to see if there are any results
          if (result.rows.length) {
            if (dataType === "posts" || dataType === "saved-posts") {
              result.rows.map(post => {
                pcData.push({
                  owner: post.owner,
                  created: post.created,
                  community: post.community,
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
              });
            } else {
              result.rows.map(comment => {
                pcData.push({
                  owner: comment.owner,
                  owns: comment.owns ? comment.owns : false,
                  saved: comment.saved ? comment.saved : false,
                  created: comment.created,
                  edited: comment.edited,
                  deleted: comment.deleted,
                  contentRaw: comment.content,
                  content: comment.content ? marked(comment.content) : null,
                  votes: comment.votes ? comment.votes : 0,
                  voted: comment.voted ? comment.voted : 0,
                  refPost: comment.parent,
                  ref: comment.ref_string,
                });
              });
            }
          } else {
            pcData = [];
          }
        } else {
          if (mode === "render") {
            res.render("misc/notFound", {logged: req.session.userId !== undefined});
          } else {
            res.json({error: "Something went wrong!"});
          }
        }
        switch (dataType) {
          case "posts":
            data.posts = pcData;
            break;

          case "comments":
            data.comments = pcData;
            break;

          case "saved-posts":
            data.savedPosts = pcData;
            break;

          case "saved-comments":
            data.savedComments = pcData;
            break;

          // because dataType is internal there can only be 4 cases, 
          // in case the user enters a wrong type it's caught before it reaches this switch
        }
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
      if (mode === "render") {
        return res.render("navigation/profile", {logged: req.session.userId !== undefined, own: true, error: "You can't view posts/comments!"});
      } else {
        return res.json({own: true, error: "You can't view posts/comments"});
      }
    }
  }
}