"use strict";// DOM MANIPULATION
// GET ELEMENT
var getEl=function(a){var b=!(1<arguments.length&&arguments[1]!==void 0)||arguments[1];return b?document.querySelector(a):document.querySelectorAll(a)},addAttr=function(a,b,c){a.addAttribute(b,c)},deleteAttr=function(a,b){a.removeAttribute(b)},modifyInnerText=function(a,b){a.innerHTML=b},createEl=function(a,b,c,d){var e;e=b?b.appendChild(document.createElement(a)):document.body.appendChild(document.createElement(a)),c&&e.setAttribute("id",c),d&&e.setAttribute("class",d)},deleteEl=function(a,b){// delete all children elements
if(a.parentNode&&a.parentNode.removeChild(a),b)for(;a.firstChild;)a.removeChild(a.firstChild)},cloneEl=function(a){return a.cloneNode(!0)},createButton=function(a,b){var c=getEl("#".concat(a));c.addEventListener("click",b)},postMinMax=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".post-small-preview"),c=a.querySelector(".post-large-preview");"flex"!==b.style.display&&b.style.display?(c.style.display="none",b.style.display="flex",a.querySelector(".post-votes").style.margin="0",event.currentTarget.src="/static/assets/icons/maximize.svg"):(c.style.display="block",b.style.display="none",a.querySelector(".post-votes").style.margin="0 0 auto",event.currentTarget.src="/static/assets/icons/minimize.svg")},postUpdateVoteState=function(a){"up"===a?(console.log(event.currentTarget.parentNode),console.log(event.currentTarget.parentNode.querySelector(".post-votes-amount")),event.currentTarget.parentNode.querySelector(".post-votes-amount").innerHTML+=1):"down"==a},postUpdateSaveState=function(){var a=event.currentTarget;"true"===a.saved?(a.src="/static/assets/icons/star.svg",a.saved="false"):(a.src="/static/assets/icons/starFill.svg",a.saved="true")},postHide=function(){var a=event.currentTarget.parentNode.parentNode.parentNode.parentNode;a.style.display="none",console.log(a)},commentMinMax=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".comment-reply");"none"!==b.style.display&&b.style.display?(b.style.display="none",a.querySelector(".comment-votes").style.margin="0 0 0 -24px"):(b.style.display="block",a.querySelector(".comment-votes").style.margin="0 0 auto -24px")},commentReply=function(){console.log("replied")};// ADD ATTRIBUTE
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
