const db = require("../../database/query");

exports.add = (req, res) => {
  const {community, title, link, content, type, flag, throwaway} = req.body;

  if (req.session.userId) {
    const query = `INSERT INTO post (community, owner, title, link, content, type, flag, throwaway) 
                    VALUES (
                      (SELECT id FROM community WHERE unique_name=$1), 
                      $2, $3, $4, $5, $6, $7, $8
                    )`;

    // define the type of the post based on user input and link
    const defineType = (link, type) => {
      if (type === "link") {
        const l1 = link[link.length - 1], l2 = link[link.length - 2], l3 = link[link.length - 3], l4 = link[link.length - 4];
        // check to see if there is a dot before the extension
        if (link[link.length - 4] === "." || link[link.length - 5] === ".") {
          // JPG, JPEG, PNG, GIF, SVG, BMP
          if ((l1 === "g" && l2 === "p" && l3 === "j") ||
          (l1 === "g" && l2 === "e" && l3 === "p" && l4 === "j") ||
          (l1 === "g" && l2 === "n" && l3 === "p") ||
          (l1 === "f" && l2 === "i" && l3 === "g") ||
          (l1 === "g" && l2 === "v" && l3 === "s") ||
          (l1 === "p" && l2 === "m" && l3 === "b")) {
            return "photo";
          }

          // MP4, WEBM, OGG
          if ((l1 === "4" && l2 === "p" && l3 === "m") ||
              (l1 === "m" && l2 === "b" && l3 === "e" && l4 === "w") ||
              (l1 === "g" && l2 === "g" && l3 === "o")) {
            return "video";
          }
        }
        return "link";
      }
      return "text";
    }
    const queryParams = [community.toLowerCase(), req.session.userId, title, link ? link : null, content ? content : null, defineType(link, type), flag ? flag : null, throwaway];

    db.query(query, queryParams, (error, result) => {
      if (!error && result.rowCount) {
        res.status(200).json({success: "Your post was added!"});
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  } else {
    res.status(401).json({error: "You need to be authenticated in order to add a post!"});
  }
}

exports.edit = (req, res) => {
  const {refPost, editedText} = req.body;

  if (req.session.userId) {
    const query = `UPDATE post 
                    SET content=$1, edited=NOW() 
                    WHERE ref_string=$2 AND owner=$3`;

    const queryParams = [editedText, refPost, req.session.userId];

    db.query(query, queryParams, (error, result) => {
      if (!error) {
        if (result.rowCount) {
          res.status(200).json({success: "Your post was edited!"});
        } else {
          res.status(403).json({error: "Unauthorized to edit this post!"});
        }
      } else {
        res.status(502).json({error: "Something went wrong!"});
      }
    });
  } else {
    res.status(401).json({error: "You need to be authenticated in order to edit a post!"});
  }
}

exports.delete = (req, res) => {
  const {refPost} = req.body;

  if (req.session.userId) {
    const query = `UPDATE post 
                    SET owner=NULL, created=NULL, title=NULL, link=NULL, content=NULL, 
                      community=NULL, type=NULL, flag=NULL, edited=NULL, throwaway=NULL,
                      hidden=NULL, deleted=TRUE
                    WHERE ref_string=$1 AND owner=$2`;

    const queryParams = [refPost, req.session.userId];

    db.query(query, queryParams, (error, result) => {
      if (!error) {
        if (result.rowCount) {
          res.status(200).json({success: "Your post was deleted!"});
        } else {
          res.status(403).json({error: "Unauthorized to delete this post!"});
        }
      } else {
        res.status(502).json({error: "Somethin went wrong!"});
      }
    });
  } else {
    res.status(401).json({error: "You need to be authenticated in order to delete a post!"});
  }
}