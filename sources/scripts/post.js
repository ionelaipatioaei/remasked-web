// post functions
const postMinMax = () => {
  const mainContainer = event.currentTarget.parentNode.parentNode.parentNode;
  const min = mainContainer.querySelector(".post-small-preview");
  const max = mainContainer.querySelector(".post-large-preview");
  if (min.style.display === "flex" || !min.style.display) {
    max.style.display = "block";
    min.style.display = "none";
    mainContainer.querySelector(".post-votes").style.margin = "0 0 auto";
    event.currentTarget.src = "/static/assets/icons/minimize.svg";
  } else {
    max.style.display = "none";
    min.style.display = "flex";
    mainContainer.querySelector(".post-votes").style.margin = "0";
    event.currentTarget.src = "/static/assets/icons/maximize.svg";
  }
}

const postUpdateVoteState = (action, voted) => {
  // stupid way to do things!
  const votes = event.currentTarget.parentNode.querySelector(".post-votes-amount");
  if (action === "up" && parseInt(voted) === 0) {
    votes.innerHTML = parseInt(votes.innerHTML) + 1;
  } else if (action === "down" && parseInt(voted) === 0) {
    votes.innerHTML = parseInt(votes.innerHTML) - 1;
  } else if (action === "up" && parseInt(voted) === -1) {
    votes.innerHTML = parseInt(votes.innerHTML) + 2;
  } else if (action === "down" && parseInt(voted) === 1) {
    votes.innerHTML = parseInt(votes.innerHTML) - 2;
  }
}

const postUpdateSaveState = () => {
  const postSave = event.currentTarget;
  if (postSave.saved === "true") {
    postSave.src = "/static/assets/icons/star.svg";
    postSave.saved = "false";
  } else {
    postSave.src = "/static/assets/icons/starFill.svg";
    postSave.saved = "true";
  }
}

const postHide = () => {
  const post = event.currentTarget.parentNode.parentNode.parentNode.parentNode;
  post.style.display = "none";
  console.log(post);
}
