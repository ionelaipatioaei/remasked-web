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
  const text = event.currentTarget.parentNode.parentNode.querySelector("textarea");
  const throwaway = event.currentTarget.parentNode.parentNode.querySelector("#comment-throwaway-checkbox");

  fetch("http://localhost:8081/api/comment", {
    method: "POST",
    body: JSON.stringify({
      refPost: refPost,
      refComment: refComment,
      content: text.value,
      throwaway: throwaway.checked
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

const commentUpdateSaveState = (refComment) => {
  const commentSave = event.currentTarget;
  const star = commentSave.parentNode.querySelector("img");

  fetch("http://localhost:8081/api/save", {
    method: "POST",
    body: JSON.stringify({
      refComment: refComment
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        if (data.remove) {
          star.src = "/static/assets/icons/star.svg";
          commentSave.innerHTML = "save";
        } else {
          star.src = "/static/assets/icons/starFill.svg";
          commentSave.innerHTML = "unsave";
        }
      } else if (data.error) {
        notificationShow("error", data.error, 5000);
      }
    })
    .catch(error => console.log(error));
}

const commentUpdateVoteState = (vote, ref) => {
  const votes = event.currentTarget.parentNode.querySelector(".comment-votes-amount");
  const upvote = votes.parentNode.querySelector("#comment-upvote");
  const downvote = votes.parentNode.querySelector("#comment-downvote");

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
        notificationShow("error", data.error, 5000);
      }
    })
    .catch(error => console.log(error));
}

const commentReport = () => {
  console.log("work in progress...");
}

const commentReplyMain = (refPost) => {
  const text = event.currentTarget.parentNode.parentNode.querySelector("textarea");
  const throwaway = event.currentTarget.parentNode.parentNode.querySelector("#comment-throwaway-checkbox");

  fetch("http://localhost:8081/api/comment", {
    method: "POST",
    body: JSON.stringify({
      refPost: refPost,
      refComment: null,
      content: text.value,
      throwaway: throwaway.checked
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

const commentSaveEdit = (refComment, refPost) => {
  const main = event.currentTarget.parentNode.parentNode;
  const editedText = main.querySelector("textarea").value;

  fetch("http://localhost:8081/api/comment", {
    method: "PUT",
    body: JSON.stringify({
      refComment: refComment,
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

const commentDelete = () => {
  const main = event.currentTarget.parentNode;
  main.querySelector("#delete").style.display = "none";
  main.querySelector("#delete-confirm").style.display = "block";
  main.querySelector("#delete-cancel").style.display = "block";
}

const commentDeleteConfirm = (refComment, refPost) => {

  fetch("http://localhost:8081/api/comment", {
    method: "DELETE",
    body: JSON.stringify({
      refComment: refComment,
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

const commentDeleteCancel = () => {
  const main = event.currentTarget.parentNode;
  main.querySelector("#delete").style.display = "block";
  main.querySelector("#delete-confirm").style.display = "none";
  main.querySelector("#delete-cancel").style.display = "none";
}

const commentThrowaway = () => {
  const main = event.currentTarget.parentNode;
  main.querySelector("#throwaway").style.display = "none";
  main.querySelector("#throwaway-confirm").style.display = "block";
  main.querySelector("#throwaway-cancel").style.display = "block";
}

const commentThrowawayConfirm = (refComment) => {
  fetch("http://localhost:8081/api/throwaway", {
    method: "POST",
    body: JSON.stringify({
      refComment: refComment
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

const commentThrowawayCancel = () => {
  const main = event.currentTarget.parentNode;
  main.querySelector("#throwaway").style.display = "block";
  main.querySelector("#throwaway-confirm").style.display = "none";
  main.querySelector("#throwaway-cancel").style.display = "none";
}