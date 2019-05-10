const db = require("../../database/query");
const checkName = require("../../shared/checkName");

exports.add = (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  // .toLowerCase()

  if (req.session.userId) {
    const query = `INSERT INTO community (createdby, name, meta, unique_name) 
                    VALUES ($1, $2, $3, $4)`;

    const queryParams = [req.session.userId, name, description, name.toLowerCase()];

    if (checkName(name) && name.length >= 3) {
      db.query(query, queryParams, (error, result) => {
        if (!error && result.rowCount) {
          res.status(200).json({success: "The community was created!"});
        } else {
          if (error.constraint === "community_unique_name_key") {
            res.status(409).json({error: "Community already exists!"});
          } else {
            res.status(502).json({error: "Something went wrong!"});
          }
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
                    WHERE unique_name=$2 AND createdby=$3`;
    
    const queryParams = [editedText, name.toLowerCase(), req.session.userId];
    
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