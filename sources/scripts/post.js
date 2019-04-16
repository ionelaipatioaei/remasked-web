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
  // stupid way to do things!
  const votes = event.currentTarget.parentNode.querySelector(".post-votes-amount");

  fetch("http://localhost:8081/api/vote", {
    method: "POST",
    body: JSON.stringify({
      refPost: ref,
      vote: vote
    })
  }).then(res => res.json())
    .then(data => {
      if (data.remove && data.success) {
        votes.innerHTML = parseInt(votes.innerHTML) - vote;
        votes.style.color = "black";
      } else if (data.success) {
        votes.innerHTML = parseInt(votes.innerHTML) + vote;
        votes.style.color = vote === 1 ? "green" : "red";
      }
      console.log(data);
    })
    .catch(error => console.log(error));
}

const postUpdateSaveState = (refPost) => {
  const postSave = event.currentTarget;

  fetch("http://localhost:8081/api/save", {
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
      } else {
        console.log("Something went wrong");
      }
    })
    .catch(error => console.log(error));
}

const postHide = () => {
  const post = event.currentTarget.parentNode.parentNode.parentNode.parentNode;
  post.style.display = "none";
  console.log(post);
}

const postEdit = () => {
  postMinMax();
  const main = event.currentTarget.parentNode.parentNode;
  const content = main.querySelector(".post-large-preview");
  const edit = main.querySelector(".post-edit");

  content.style.display = "none";
  edit.style.display = "block";
  console.log(main);
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
  fetch("http://localhost:8081/api/post", {
    method: "PUT",
    body: JSON.stringify({
      refPost: refPost,
      editedText: editedText     
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.reload();
      } else {
        console.log(data);
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
  fetch("http://localhost:8081/api/post", {
    method: "DELETE",
    body: JSON.stringify({
      refPost: refPost
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.reload();
      } else {
        console.log(data);
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
