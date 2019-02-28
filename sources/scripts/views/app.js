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
const postUpdateTextColor = () => {
  console.log(event.currentTarget.parentNode.querySelector("#post"));
}

const postUpdateVoteStatus = action => {
  if (action === "up") {
    console.log(event.currentTarget.parentNode);
    console.log(event.currentTarget.parentNode.querySelector(".post-votes-amount"));

    event.currentTarget.parentNode.querySelector(".post-votes-amount").innerHTML += 1;
  } else if (action === "down") {

  }
}