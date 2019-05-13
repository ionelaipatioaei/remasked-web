const db = require("../../database/query");
const cache = require("../../cache/query");

// store the communities for ~1 month
const COMMUNITIES_CACHE_TTL = 2500000;

module.exports = (mode) => {
  return (req, res) => {
    if (req.session.userId) {
      const cacheKey = `communities:user:${req.session.userId}`;
      let communities = [];

      cache.get(cacheKey, (error, cachedData) => {
        if (!error) {
          if (cachedData) {
            if (mode === "render") return res.status(200).render("navigation/communities", {logged: req.session.userId !== undefined, communities: JSON.parse(cachedData)});
            else return res.status(200).json({communities: JSON.parse(cachedData)});
          } else {
            
            const query = `SELECT 
                            community_id, 
                            (SELECT name FROM community WHERE id=community_id) AS name, 
                            TO_CHAR(subscribed, 'DD Mon YY') AS subscribed 
                          FROM subscription 
                          WHERE user_id=$1 ORDER BY name`;

            const queryParams = [req.session.userId];

            db.query(query, queryParams, (error, result) => {
              if (!error) {
                result.rows.map(community => {
                  communities.push({
                    name: community.name,
                    subscribed: community.subscribed
                  });
                });
                cache.setex(cacheKey, COMMUNITIES_CACHE_TTL, JSON.stringify(communities));

                if (mode === "render") res.status(200).render("navigation/communities", {logged: req.session.userId !== undefined, communities});
                else res.status(200).json(communities);
              } else {
                if (mode === "render") res.status(502).render("navigation/communities", {logged: req.session.userId !== undefined});
                else res.status(502).json({error: "Something went wrong!"});
              }
            });

          }
        } else {
          if (mode === "render") return res.status(502).render("misc/error", {logged: req.session.userId !== undefined, error: 502});
          else return res.status(502).json({error: "Something went wrong!"});
        }
      });

    } else {
      if (mode === "render") res.status(401).render("navigation/communities", {logged: req.session.userId !== undefined, error: "You need to be logged in order to see saved communities!"});
      else res.status(401).json({error: "You need to be authenticated in order to see your saved communities!"});
    }
  }
}