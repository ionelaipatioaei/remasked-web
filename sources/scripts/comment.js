// comment functions
const commentMinMax = () => {
  const elementWithTextarea = event.currentTarget.parentNode.parentNode.parentNode;
  const reply = elementWithTextarea.querySelector(".comment-reply");
  if (reply.style.display === "none" || !reply.style.display) {
    reply.style.display = "block";
    reply.querySelector(".comment-textarea").focus();
    elementWithTextarea.querySelector(".comment-votes").style.margin = "0 0 auto -24px";
  } else {
    const votes = event.currentTarget.parentNode.parentNode.parentNode.parentNode;
    votes.querySelector(".comment-votes").style.margin = "0 0 0 -24px";
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
  append.insertAdjacentHTML("afterend", createCommentText(text.value));
  text.value = "";
  const reply = append.querySelector(".comment-reply");
  reply.style.display = "none";
  append.querySelector(".comment-votes").style.margin = "0 0 0 -24px";
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
      if (data.remove) {
        votes.innerHTML = parseInt(votes.innerHTML) - vote;
      } else {
        votes.innerHTML = parseInt(votes.innerHTML) + vote;
      }
      console.log(data);
    })
    .catch(error => console.log(error));
}

const commentReport = () => {
  console.log("haha");
}

const createCommentText = (text) => {
  const findUrl = (text) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a target="_blank" href="' + url + '">' + url + '</a>';
    });
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  let values = text;
  let txt = "<p class='comment-text'>"
  for(let i = 0; i < values.length; i++) {
    if(values[i] == "\n" && values[i + 1] == "\n") {
      txt += "</p><p class='comment-text'>";
      i += 1;
    } else if(values[i] == "\n") {
      txt += "<br/>";
    } else {
      txt += escapeHtml(values[i]);
    }
  }
  return `
    <div class="comment-container">
      <div class="comment-content">
        <div class="comment-main">
          <div class="comment-info">
            <p class="comment-info-text" style="font-style: italic">You replied:</p>
          </div>
          <div class="comment-text-container">
            ${findUrl(txt)}
          </div>
        </div>
      </div>
    </div>
  `;
}

const commentReplyMain = (refPost) => {
  const text = event.currentTarget.parentNode.parentNode.querySelector("textarea");
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
  const append = document.querySelector(".reply-container");  
  append.insertAdjacentHTML("afterend", createCommentText(text.value));
  text.value = "";
}