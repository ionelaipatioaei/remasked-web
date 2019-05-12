const getQueryFromUrl = () => decodeURI(window.location.search)
  .replace("?", "").split("&").map(param => param.split("="))
  .reduce((values, [key, value]) => {
    values[key] = value;
    return values;
  }, {});
  
const next = (append) => {
  const query = getQueryFromUrl();
  if (query.page === undefined || query.page <= 0) {
    query.page = 1;
  } else {
    query.page = query.page + 1;
  }
  window.location.href = `/${append}?page=${query.page}&sort=${query.sort ? query.sort : "popular"}`;
}

const back = (append) => {
  const query = getQueryFromUrl();
  if (query.page === undefined || query.page <= 0) {
    query.page = 0;
  } else {
    query.page = query.page - 1;
  }
  window.location.href = `/${append}?page=${query.page}&sort=${query.sort ? query.sort : "popular"}`;
}

const getRandomCommunity = () => {
  fetch("/api/random")
    .then(res => res.json())
    .then(data => {
      if (data.community) {
        window.location.href = `/c/${data.community}`;
      } else if (data.error) {
        notificationShow("error", data.error, 5000);
      }
    })
    .catch(error => console.log(error));
}

// Maybe in the fureture the sort method should be stored in
// localStorage and used for /c/ /post/ etc
const setSortMethod = () => {

}

const getSortMethod = () => {

}
