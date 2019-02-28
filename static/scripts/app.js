// class Button {
//   constructor(_id, _onClickCallback) {
//     this.el = document.getElementById(_id);
//     this.onClick(_onClickCallback || null);
//     this.onMouseOver();
//     console.log(this.el);
//   }
//   onClick(callback) {
//     this.el.addEventListener("click", callback);
//   }
//   onMouseOver() {
//     this.el.addEventListener("mouseover", () => {
//       console.log("hey there overrrr");
//     });
//   }
// }
// const createButton = () => {
// }
"use strict";
"use strict";// DOM MANIPULATION
// GET ELEMENT
var getEl=function(a){var b=!(1<arguments.length&&arguments[1]!==void 0)||arguments[1];return b?document.querySelector(a):document.querySelectorAll(a)},addAttr=function(a,b,c){a.addAttribute(b,c)},deleteAttr=function(a,b){a.removeAttribute(b)},modifyInnerText=function(a,b){a.innerHTML=b},createEl=function(a,b,c,d){var e;e=b?b.appendChild(document.createElement(a)):document.body.appendChild(document.createElement(a)),c&&e.setAttribute("id",c),d&&e.setAttribute("class",d)},deleteEl=function(a,b){// delete all children elements
if(a.parentNode&&a.parentNode.removeChild(a),b)for(;a.firstChild;)a.removeChild(a.firstChild)},cloneEl=function(a){return a.cloneNode(!0)},createButton=function(a,b){var c=getEl("#".concat(a));c.addEventListener("click",b)},postUpdateTextColor=function(){console.log(event.currentTarget.parentNode.querySelector("#post"))},postUpdateVoteStatus=function(a){"up"===a?(console.log(event.currentTarget.parentNode),console.log(event.currentTarget.parentNode.querySelector(".post-votes-amount")),event.currentTarget.parentNode.querySelector(".post-votes-amount").innerHTML+=1):"down"==a};// ADD ATTRIBUTE
