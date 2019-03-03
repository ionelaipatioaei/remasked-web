// DOM MANIPULATION
// GET ELEMENT
const getEl = (query, single = true) => {
  if (single) {
    return document.querySelector(query);
  } else {
    return document.querySelectorAll(query);
  }
}

// ADD ATTRIBUTE
const addAttr= (element, attributeName, attributeValue) => {
  element.addAttribute(attributeName, attributeValue);
}

// REMOVE ATTRIBUTE
const deleteAttr = (element, attributeName) => {
  element.removeAttribute(attributeName);
}

// ADD/CHANGE INNER HTML
const modifyInnerText = (element, text) => {
  element.innerHTML = text;
}

// CREATE ELEMENT
const createEl = (element, appendTo, id, cls) => {
  let ref;

  if (appendTo) {
    ref = appendTo.appendChild(document.createElement(element));
  } else {
    ref = document.body.appendChild(document.createElement(element));
  }

  if (id) {
    ref.setAttribute("id", id);
  }

  if (cls) {
    ref.setAttribute("class", cls);
  }
}

// UPDATE ELEMENT - USE DOM MANIPULATIONS FOR THIS

// DELETE ELEMENT
const deleteEl = (element, cascade) => {
  // some fuckery is going on here
  // delete only the element
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
  // delete all children elements
  if (cascade) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

// CLONE ELEMENT
const cloneEl = (element) => {
  return element.cloneNode(true);
}

// COMPONENTS
// BUTTON
const createButton = (id, onClick) => {
  const ref = getEl(`#${id}`);

  ref.addEventListener("click", onClick);
}

// const test = () => console.log("fuck this shit");

// APP INTERACTIONS
// const heyButton = createButton("hey", () => console.log("test"));
// event.currentTarget.parentNode.querySelector("#post")

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

const postUpdateVoteState = action => {
  if (action === "up") {
    console.log(event.currentTarget.parentNode);
    console.log(event.currentTarget.parentNode.querySelector(".post-votes-amount"));

    event.currentTarget.parentNode.querySelector(".post-votes-amount").innerHTML += 1;
  } else if (action === "down") {

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

// comment functions
const commentMinMax = () => {
  const elementWithTextarea = event.currentTarget.parentNode.parentNode.parentNode;
  const reply = elementWithTextarea.querySelector(".comment-reply");
  if (reply.style.display === "none" || !reply.style.display) {
    reply.style.display = "block";
    elementWithTextarea.querySelector(".comment-votes").style.margin = "0 0 auto -24px";
  } else {
    reply.style.display = "none";
    elementWithTextarea.querySelector(".comment-votes").style.margin = "0 0 0 -24px";
  }
}

const commentReply = () => {
  console.log("replied");
  // commentMinMax();
}

// const commentUpdateSaveState = () => {
//   const commentSave = event.currentTarget;
//   if (commentSave.saved === "true") {
//     commentSave.src = "/static/assets/icons/star.svg";
//     commentSave.saved = "false";
//   } else {
//     commentSave.src = "/static/assets/icons/starFill.svg";
//     commentSave.saved = "true";
//   }
// }