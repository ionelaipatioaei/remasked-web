const db = require("../../database/query");
const marked = require("marked");
marked.setOptions({
  breaks: true,
  sanitize: true
});

module.exports = (mode) => {
  return async (req, res) => {
    if (req.session.userId) {

      const query = `SELECT community_id, (SELECT name FROM community WHERE id=community_id) AS name, 
        (SELECT meta FROM community WHERE id=community_id) AS meta, TO_CHAR(subscribed, 'DD/MM/YY') AS subscribed 
        FROM subscription WHERE user_id=$1 ORDER BY name`;

      const queryParams = [req.session.userId];

      await db.query(query, queryParams, (error, result) => {
        if (!error && result.rows.length) {
          let communities = [];
          result.rows.map(community => {
            communities.push({
              name: community.name,
              subscribed: community.subscribed,
              meta: community.meta ? marked(community.meta) : null
              // subscribers: community.subscribers
            });
          });

          if (mode === "render") {
            res.render("navigation/communities", {logged: req.session.userId !== undefined, communities});
          } else {
            res.json({communities});
          }
        } else if (result.rows.length < 1) {
          if (mode === "render") {
            res.render("navigation/communities", {logged: req.session.userId !== undefined, error: "You are not subscribed to any community!"});
          } else {
            res.json({error: "You are not subscribed to any community!"});
          }
        } else {
          if (mode === "render") {
            res.render("navigation/communities", {logged: req.session.userId !== undefined, error: "Something went wrong!"});
          } else {
            res.json({error: "Something went wrong!"});
          }
        }
      });

    } else {
      if (mode === "render") {
        res.render("navigation/communities", {logged: req.session.userId !== undefined, error: "You need to be logged in order to see saved communities!"});
      } else {
        res.json({error: "You need to be logged in order to see saved communities!"});
      }
    }
  }
}