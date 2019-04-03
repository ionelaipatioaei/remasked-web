const Pool = require("pg").Pool;
const db = new Pool();

exports.postAdd = (req, res) => {
  const {community, title, link, content, type, flag} = req.body;

  if (req.session.userId) {
    const query = `INSERT INTO post (community, owner, title, link, content, type, flag) 
      VALUES ((SELECT id FROM community WHERE name=$1), $2, $3, $4, $5, $6, $7)`;

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
    const queryParams = [community, req.session.userId, title, link, content, defineType(link, type), flag];

    db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "Your post was registered!"});
      } else {
        res.json({er: error, re: result});
      }
    });
  } else {
    res.json({error: "You need to have an account in order to post!"});
  }
}

exports.postEdit = (req, res) => {
  const {refPost, editedText} = req.body;

  if (req.session.userId) {
    const query = `UPDATE post SET content=$1, edited=NOW() WHERE ref_string=$2 AND owner=$3`;

    const queryParams = [editedText, refPost, req.session.userId];

    db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "Your post was updated!"})
      } else {
        res.json({error: "Something went wrong or this isn't your post!"});
      }
    });
  } else {
    res.json({error: "You need an account in order to edit a post!"});
  }
}

exports.postDelete = (req, res) => {
  const {refPost} = req.body;

  if (req.session.userId) {
    const query = `UPDATE comment SET owner=NULL, created=NULL, title=NULL, link=NULL, content=NULL, edited=NULL, deleted=TRUE 
      WHERE ref_string=$1 AND owner=$2`;

    const queryParams = [refPost, queryParams];

    db.query(query, queryParams, (error, result) => {
      if (!error) {
        res.json({success: "Your post was deleted!"});
      } else {
        res.json({error: "Something went wrong or this isn't your post!"});
      }
    });
  } else {
    res.json({error: "You need an account in order to edit a post!"});
  }
}