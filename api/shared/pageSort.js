module.exports = (page, sortby, perPage = 16) => {
  let limits, sort;
  if ((typeof page === "number" && (page % 1) === 0) && page > 0) {
    limits = [page * perPage, perPage];
  } else {
    limits = [0, perPage];
  }

  // POPULAR, TOP, NEWEST, OLDEST, MOST UPVOTED, MOST DOWNVOTED 
  const sortingMethods = ["id", "id", "id DESC", "id ASC", "votes DESC", "votes ASC"];
  switch(sortby) {
    case "top":
      sort = sortingMethods[1];
      break;
    case "newest":
      sort = sortingMethods[2];
      break;
    case "oldest":
      sort = sortingMethods[3];
      break;
    case "most-upvoted":
      sort = sortingMethods[4];
      break;
    case "most-downvoted":
      sort = sortingMethods[5];
      break;
    default:
      sort = sortingMethods[0];
      break;
  }

  return {limits, sort};
}