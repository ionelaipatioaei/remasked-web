// comment functions
const commentMinMax = () => {
  const elementWithTextarea = event.currentTarget.parentNode.parentNode.parentNode;
  const reply = elementWithTextarea.querySelector(".comment-reply");
  if (reply.style.display === "none" || !reply.style.display) {
    reply.style.display = "block";
    reply.querySelector(".input-textarea").focus();
  } else {
    reply.style.display = "none";
  }
}

const commentCollapse = () => {
  const tree = event.currentTarget.parentNode.parentNode.parentNode.parentNode;
  const info = tree.querySelector(".comment-info-text-container");
  
  const text = tree.querySelector(".comment-text-container");
  const actions = tree.querySelector(".comment-info-actions-container");
  const votes = tree.querySelector(".comment-votes");
  const children = tree.querySelectorAll(".comment-container");
  const reply = tree.querySelector(".comment-reply");

  if (info.style.fontStyle === "unset" || !info.style.fontStyle) {
    event.currentTarget.src = "/static/assets/icons/plus.svg";
    info.style.fontStyle = "italic";
    text.style.display = "none";
    actions.style.display = "none";
    votes.style.display = "none";
    reply.style.display = "none";
    
    for(let i = 0; i < children.length; i++) {
      children[i].style.display = "none";
    }
  } else {
    event.currentTarget.src = "/static/assets/icons/minus.svg";
    info.style.fontStyle = "unset";
    text.style.display = "block";
    actions.style.display = "flex";
    votes.style.display = "flex";
    
    for(let i = 0; i < children.length; i++) {
      children[i].style.display = "block";
    }
  }
}

const commentReply = (refPost, refComment) => {
  console.log(refPost, refComment);
  const text = event.currentTarget.parentNode.parentNode.querySelector("textarea");
  fetch("http://localhost:8081/api/comment", {
    method: "POST",
    body: JSON.stringify({
      refPost: refPost,
      refComment: refComment,
      content: text.value
    })
  }).then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));

  const append = event.currentTarget.parentNode.parentNode.parentNode.parentNode;
  // append.insertAdjacentHTML("afterend", createCommentText(text.value));
  text.value = "";
  const reply = append.querySelector(".comment-reply");
  reply.style.display = "none";
  window.location.reload();
}

const commentUpdateSaveState = () => {
  const commentSave = event.currentTarget;
  const star = commentSave.parentNode.querySelector("img");
  if (commentSave.saved === "true") {
    star.src = "/static/assets/icons/star.svg";
    commentSave.saved = "false";
    commentSave.innerHTML = "save";
  } else {
    star.src = "/static/assets/icons/starFill.svg";
    commentSave.saved = "true";
    commentSave.innerHTML = "unsave";
  }
}

const commentUpdateVoteState = (vote, ref) => {
  const votes = event.currentTarget.parentNode.querySelector(".comment-votes-amount");
  console.log(vote, ref);
  fetch("http://localhost:8081/api/vote", {
    method: "POST",
    body: JSON.stringify({
      refComment: ref,
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

const commentReport = () => {
  console.log("haha");
}

const commentReplyMain = (refPost) => {
  const text = event.currentTarget.parentNode.parentNode.querySelector("textarea");
  console.log(text.value);
  fetch("http://localhost:8081/api/comment", {
    method: "POST",
    body: JSON.stringify({
      refPost: refPost,
      refComment: null,
      content: text.value
    })
  }).then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
  // const append = document.querySelector(".reply-container");
  // append.insertAdjacentHTML("afterend", createCommentText(text.value));
  text.value = "";
  // THIS IS STUPID
  window.location.reload();
}

const commentEdit = () => {
  const main = event.currentTarget.parentNode.parentNode;
  const content = main.querySelector(".comment-text-container");
  const edit = main.querySelector(".comment-edit");

  content.style.display = "none";
  edit.style.display = "block";
}

const commentCancelEdit = () => {
  const main = event.currentTarget.parentNode.parentNode.parentNode;
  const content = main.querySelector(".comment-text-container");
  const edit = main.querySelector(".comment-edit");

  content.style.display = "block";
  edit.style.display = "none";
}

const commentSaveEdit = (refComment) => {
  const main = event.currentTarget.parentNode.parentNode;
  const editedText = main.querySelector("textarea").value;
  fetch("http://localhost:8081/api/comment", {
    method: "PUT",
    body: JSON.stringify({
      refComment: refComment,
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

const commentDelete = () => {
  const main = event.currentTarget.parentNode;
  main.querySelector("#delete").style.display = "none";
  main.querySelector("#delete-confirm").style.display = "block";
  main.querySelector("#delete-cancel").style.display = "block";
}

const commentDeleteConfirm = (refComment) => {
  fetch("http://localhost:8081/api/comment", {
    method: "DELETE",
    body: JSON.stringify({
      refComment: refComment
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

const commentDeleteCancel = () => {
  const main = event.currentTarget.parentNode;
  main.querySelector("#delete").style.display = "block";
  main.querySelector("#delete-confirm").style.display = "none";
  main.querySelector("#delete-cancel").style.display = "none";
}