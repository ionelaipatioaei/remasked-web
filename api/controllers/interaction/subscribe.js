const db = require("../../database/query");

module.exports = (req, res) => {
  const {name} = req.body;

  const updateSubscriptionStatus = async (name, id) => {
    const query = `SELECT EXISTS(
                    SELECT 1 FROM subscription 
                    WHERE user_id=$1 
                      AND community_id=(SELECT id FROM community WHERE name=$2)
                    )`;

    const queryParams = [id, name];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        if (result.rows[0].exists) {
          removeSubscription(name, id);
        } else {
          addSubscription(name, id);
        }
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const addSubscription = async (name, id) => {
    const query = `INSERT INTO subscription (user_id, community_id) 
                    VALUES (
                      $1, 
                      (SELECT id FROM community WHERE name=$2)
                    )`;

    const queryParams = [id, name];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: `You subscribed to ${name}!`});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  const removeSubscription = async (name, id) => {
    const query = `DELETE FROM subscription 
                    WHERE user_id=$1 
                      AND community_id=(SELECT id FROM community WHERE name=$2)`;

    const queryParams = [id, name];

    await db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: `You unsubscribed from ${name}!`});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  }

  if (req.session.userId) {
    if (name) {
      updateSubscriptionStatus(name, req.session.userId);
    } else {
      res.json({error: "The community name invalid!"});
    }
  } else {
    res.json({error: "You need an account in order to subscribe or unsubscribe!"});
  }
}