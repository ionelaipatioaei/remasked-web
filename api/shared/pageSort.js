module.exports = (page, sortby, perPage = 16) => {
  let limits, sort;
  if ((typeof page === "number" && (page % 1) === 0) && page > 0) {
    limits = [page * perPage, perPage];
  } else {
    limits = [0, perPage];
  }

  // POPULAR, NEWEST, OLDEST, SHUFFLE
  const sortingMethods = [
    "(COUNT(comment) + COALESCE((SELECT SUM(vote) FROM vote_post WHERE post_id=post.id), 0)) DESC", 
    "id DESC", 
    "id ASC", 
    "random()"
  ];

  if (sortby === "newest") sort = sortingMethods[1];
  else if (sortby === "oldest") sort = sortingMethods[2];
  else if (sortby === "shuffle") sort = sortingMethods[3]
  // is the sort is invalid make it popular, this is aslo the default
  else sort = sortingMethods[0];

  return {limits, sort};
}