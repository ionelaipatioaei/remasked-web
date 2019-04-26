const db = require("../../database/query");
const checkName = require("../../shared/checkName");

exports.add = (req, res) => {
  const {name, description} = req.body;

  if (req.session.userId) {
    const query = `INSERT INTO community (createdby, name, meta) 
                    VALUES ($1, $2, $3)`;

    const queryParams = [req.session.userId, name, description];

    if (checkName(name) && name.length >= 3) {
      db.query(query, queryParams, (error, result) => {
        if (!error && result.rowCount) {
          res.status(200).json({success: "The community was created!"});
        } else {
          res.status(502).json({error: "Something went wrong!"});
        }
      });
    } else {
      res.status(400).json({error: "Community name needs to be alphanumeric and at least 3 characters long!"});
    }
  } else {
    res.status(401).json({error: "You need to be authenticated in order to add a community!"});
  }
}

exports.edit = (req, res) => {
  const {name, editedText} = req.body;
  
  if (req.session.userId) {
    const query = `UPDATE community 
                    SET meta=$1 
                    WHERE name=$2 AND createdby=$3`;
    
    const queryParams = [editedText, name, req.session.userId];
    
    db.query(query, queryParams, (error, result) => {
      if (!error) {
        if (result.rowCount) {
          res.status(200).json({success: "The community description was updated!"});
        } else {
          res.status(403).json({error: "Unauthorized to edit this community description!"});
        }
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  } else {
    res.status(401).json({error: "You need to be authenticated in order to edit a community description!"});
  }
}