const db = require("../../database/query");

exports.add = (req, res) => {
  const {name, description} = req.body;

  if (req.session.userId) {
    const query = `INSERT INTO community (createdby, name, meta) VALUES ($1, $2, $3)`;

    const queryParams = [req.session.userId, name, description];

    db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "The community was created!"});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  } else {
    res.json({error: "You need an account in order to create a community!"});
  }
}

exports.edit = (req, res) => {
  const {name, editedText} = req.body;

  if (req.session.userId) {
    const query = `UPDATE community SET meta=$1 WHERE name=$2 AND createdby=$3`;

    const queryParams = [editedText, name, req.session.userId];

    db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "The community description was updated!"});
      } else {
        res.json({error: "Something went wrong!"});
      }
    });
  } else {
    res.json({error: "You need an account in order to edit a community description!"});
  }
}