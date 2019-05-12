const db = require("../../database/query");

module.exports = (mode) => {
  return async (req, res) => {
    if (req.session.userId) {

      const query = `SELECT 
                        community_id, 
                        (SELECT name FROM community WHERE id=community_id) AS name, 
                        TO_CHAR(subscribed, 'DD Mon YY') AS subscribed 
                      FROM subscription 
                      WHERE user_id=$1 ORDER BY name`;

      const queryParams = [req.session.userId];

      await db.query(query, queryParams, (error, result) => {
        if (!error) {
          let communities = [];
          result.rows.map(community => {
            communities.push({
              name: community.name,
              subscribed: community.subscribed
            });
          });

          if (mode === "render") res.status(200).render("navigation/communities", {logged: req.session.userId !== undefined, communities});
          else res.status(200).json({communities});
        } else {
          if (mode === "render") res.status(502).render("navigation/communities", {logged: req.session.userId !== undefined});
          else res.status(502).json({error: "Something went wrong!"});
        }
      });

    } else {
      if (mode === "render") res.status(401).render("navigation/communities", {logged: req.session.userId !== undefined, error: "You need to be logged in order to see saved communities!"});
      else res.status(401).json({error: "You need to be authenticated in order to see your saved communities!"});
    }
  }
}