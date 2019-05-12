module.exports = (type, userId, currentId) => {
  switch(type) {
    case "posts":
      return userId ?
        `SELECT id, ref_string, title, link, content, type, flag, deleted, throwaway, hidden,
            (CASE WHEN owner=$2 THEN true ELSE false END) AS owns, 
            (SELECT vote FROM vote_post WHERE user_id=$2 AND post_id=post.id) as voted, 
            (SELECT EXISTS(SELECT 1 FROM save_post WHERE user_id=$2 AND post_id=post.id)) AS saved,
            (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
            (SELECT username FROM users WHERE id=post.owner) as owner,
            (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes,
            TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, 
            TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited
          FROM post 
          WHERE owner=(SELECT id FROM users WHERE unique_name=$1) 
          ORDER BY id DESC LIMIT 32`
        :
        `SELECT id, ref_string, title, link, content, type, flag, deleted, throwaway, hidden,
            (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
            (SELECT username FROM users WHERE id=post.owner) as owner,
            (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes, 
            TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created,
            TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited,
            (SELECT name FROM community WHERE id=community) AS community
          FROM post 
          WHERE owner=(SELECT id FROM users WHERE unique_name=$1)
          ORDER BY id DESC LIMIT 32`;

    case "comments":
      return userId ?
        `SELECT id, ref_string, content, deleted, throwaway, hidden,
            (CASE WHEN owner=$2 THEN true ELSE false END) AS owns,
            (SELECT vote FROM vote_comment WHERE user_id=$2 AND comment_id=id) as voted, 
            (SELECT EXISTS(SELECT 1 FROM save_comment WHERE user_id=$2 AND comment_id=comment.id)) AS saved,
            (SELECT username FROM users WHERE id=owner) AS owner, 
            (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, 
            TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created,
            TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited, 
            (SELECT ref_string FROM post WHERE id=post_parent) AS parent 
          FROM comment 
          WHERE owner=(SELECT id FROM users WHERE unique_name=$1) 
          ORDER BY id DESC`
        :
        `SELECT id, ref_string, content, deleted, throwaway, hidden, 
            (SELECT username FROM users WHERE id=owner) AS owner, 
            (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, 
            TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created,
            TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited,
            (SELECT ref_string FROM post WHERE id=post_parent) AS parent 
          FROM comment 
          WHERE owner=(SELECT id FROM users WHERE unique_name=$1) 
          ORDER BY id DESC`;

    case "saved-posts":
      return userId === currentId ?
        `SELECT id, ref_string, title, link, content, type, flag, deleted, throwaway, hidden, 
            (CASE WHEN owner=$1 THEN true ELSE false END) AS owns, 
            (SELECT vote FROM vote_post WHERE user_id=$1 AND post_id=post.id) as voted, 
            (SELECT EXISTS(SELECT 1 FROM save_post WHERE user_id=$1 AND post_id=post.id)) AS saved,
            (SELECT COUNT(*) FROM comment WHERE post_parent=post.id) AS comments_amount, 
            (SELECT username FROM users WHERE id=post.owner) as owner,
            (SELECT SUM(vote) FROM vote_post WHERE post_id=id) AS votes,
            TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created,
            TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited
          FROM post 
          WHERE id=(SELECT post_id FROM save_post WHERE user_id=$1 AND post_id=id) 
          ORDER BY id DESC`
        :
        null;

    case "saved-comments":
      return userId === currentId ?
        `SELECT id, ref_string, content, deleted, throwaway, hidden, 
            (CASE WHEN owner=$1 THEN true ELSE false END) AS owns,
            (SELECT vote FROM vote_comment WHERE user_id=$1 AND comment_id=id) as voted, 
            (SELECT EXISTS(SELECT 1 FROM save_comment WHERE user_id=$1 AND comment_id=comment.id)) AS saved,
            (SELECT username FROM users WHERE id=owner) AS owner, 
            (SELECT SUM(vote) FROM vote_comment WHERE comment_id=id) AS votes, 
            TO_CHAR(created, 'DD/MM/YY at HH24:MI') AS created, 
            TO_CHAR(edited, 'DD/MM/YY at HH24:MI') AS edited, 
            (SELECT ref_string FROM post WHERE id=post_parent) AS parent 
          FROM comment 
          WHERE id=(SELECT comment_id FROM save_comment WHERE user_id=$1 AND comment_id=id)
          ORDER BY id DESC`
        :
        null;

    default:
      return null;
  }
}