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

const postUpdateVoteState = (vote, ref) => {
  const votes = event.currentTarget.parentNode.querySelector(".post-votes-amount");
  const upvote = votes.parentNode.querySelector("#post-upvote");
  const downvote = votes.parentNode.querySelector("#post-downvote");

  fetch("/api/vote", {
    method: "POST",
    body: JSON.stringify({
      refPost: ref,
      vote: vote
    })
  }).then(res => res.json())
    .then(data => {
      if (data.remove && data.success) {
        votes.innerHTML = parseInt(votes.innerHTML) + -(vote);
        votes.style.color = "black";
        upvote.src = "/static/assets/icons/up.svg";
        downvote.src = "/static/assets/icons/down.svg";
      } else if (data.success) {
        // weird trick but it works so
        // check if upvoted
        // also for some reason it converts the hex color to rgb()
        if (vote === -1 && votes.style.color == "rgb(16, 188, 16)") {
          votes.innerHTML = parseInt(votes.innerHTML) - 2;
          // check if downvoted
        } else if (vote === 1 && votes.style.color == "rgb(243, 69, 62)") {
          votes.innerHTML = parseInt(votes.innerHTML) + 2;
        } else {
          votes.innerHTML = parseInt(votes.innerHTML) + vote;
        }
        votes.style.color = vote === 1 ? "#10bc10" : "#f3453e";

        if (vote === 1) {
          upvote.src = "/static/assets/icons/up-use.svg";
          downvote.src = "/static/assets/icons/down.svg";
        } else {
          upvote.src = "/static/assets/icons/up.svg";
          downvote.src = "/static/assets/icons/down-use.svg";
        }
      } else if (data.error) {
        notificationShow("error", data.error, 3000);
      }
    })
    .catch(error => console.log(error));
}

const postUpdateSaveState = (refPost) => {
  const postSave = event.currentTarget;

  fetch("/api/save", {
    method: "POST",
    body: JSON.stringify({
      refPost: refPost
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        if (data.remove) {
          postSave.src = "/static/assets/icons/star.svg";
        } else {
          postSave.src = "/static/assets/icons/starFill.svg";
        }
      } else if (data.error) {
        notificationShow("error", data.error, 5000);
      }
    })
    .catch(error => console.log(error));
}

const postHide = () => {
  const post = event.currentTarget.parentNode.parentNode.parentNode.parentNode;
  post.style.display = "none";
}

const postEdit = () => {
  postMinMax();
  const main = event.currentTarget.parentNode.parentNode;
  const content = main.querySelector(".post-large-preview");
  const edit = main.querySelector(".post-edit");

  content.style.display = "none";
  edit.style.display = "block";
}

const postCancelEdit = () => {
  const main = event.currentTarget.parentNode.parentNode.parentNode;
  const content = main.querySelector(".post-large-preview");
  const edit = main.querySelector(".post-edit");

  content.style.display = "block";
  edit.style.display = "none";
}

const postSaveEdit = (refPost) => {
  const main = event.currentTarget.parentNode.parentNode;
  const editedText = main.querySelector("textarea").value;
  
  fetch("/api/post", {
    method: "PUT",
    body: JSON.stringify({
      refPost: refPost,
      editedText: editedText     
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.reload();
      } else if (data.error) {
        notificationShow("error", data.error, 5000);
      }
    })
    .catch(error => console.log(error));
}

const postDelete = () => {
  const main = event.currentTarget.parentNode;
  main.querySelector("#delete").style.display = "none";
  main.querySelector("#delete-confirm").style.display = "block";
  main.querySelector("#delete-cancel").style.display = "block";
}

const postDeleteConfirm = (refPost) => {
  fetch("/api/post", {
    method: "DELETE",
    body: JSON.stringify({
      refPost: refPost
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.reload();
      } else if (data.error) {
        notificationShow("error", data.error, 5000);
      }
    })
    .catch(error => console.log(error));
}

const postDeleteCancel = () => {
  const main = event.currentTarget.parentNode;
  main.querySelector("#delete").style.display = "block";
  main.querySelector("#delete-confirm").style.display = "none";
  main.querySelector("#delete-cancel").style.display = "none";
}

const postThrowaway = () => {
  const main = event.currentTarget.parentNode;
  main.querySelector("#throwaway").style.display = "none";
  main.querySelector("#throwaway-confirm").style.display = "block";
  main.querySelector("#throwaway-cancel").style.display = "block";
}

const postThrowawayConfirm = (refPost) => {
  fetch("/api/throwaway", {
    method: "POST",
    body: JSON.stringify({
      refPost: refPost
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.reload();
      } else if (data.error) {
        notificationShow("error", data.error, 5000);
      }
    })
    .catch(error => console.log(error));
}

const postThrowawayCancel = () => {
  const main = event.currentTarget.parentNode;
  main.querySelector("#throwaway").style.display = "block";
  main.querySelector("#throwaway-confirm").style.display = "none";
  main.querySelector("#throwaway-cancel").style.display = "none";
}
