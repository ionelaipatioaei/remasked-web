// CREATE ELEMENT - ALSO WITH ATTRIBUTES
const createElement = (element, appendTo, cls, text) => {
  let ref;

  if (appendTo) {
    ref = appendTo.appendChild(document.createElement(element));
  } else {
    ref = document.body.appendChild(document.createElement(element));
  }

  ref.innerHTML = text;
  if (cls) {
    ref.setAttribute("class", cls);
  }
}

// UPDATE ELEMENT
const updateElement = (element, changes) => {

}

// DELETE ELEMENT
const deleteElement = (element, cascade) => {
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

createElement("p");

let sel = document.querySelectorAll("p")[0];
createElement("div", sel,);

const button1 = new Button("test1");
const button2 = new Button("test2");
button1.onClick(() => createElement("h2", sel, "hey1", "fuck"));

button2.onClick(() => deleteElement(document.querySelectorAll(".hey1")[0], sel));
console.log("app.js");
