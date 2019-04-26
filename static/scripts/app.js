"use strict";// auth functions
var authLogin=function(){var a=document.querySelector("#username").value,b=document.querySelector("#password").value,c=document.querySelector(".auth-warning");fetch("/api/auth/login",{method:"POST",body:JSON.stringify({username:a,password:b})}).then(function(a){return a.json()}).then(function(a){console.log(a),a.error?(document.querySelector("#password").value="",notificationShow("error",a.error,1e4)):a.success&&(notificationShow("success",a.success,1e4),window.location.href="/")}).catch(function(a){return console.log(a)})},authRegister=function(){var a=document.querySelector("#username").value,b=document.querySelector("#email").value,c=document.querySelector("#password").value,d=document.querySelector("#confirm-password").value,e=document.querySelector(".auth-warning");fetch("/api/auth/register",{method:"POST",body:JSON.stringify({username:a,email:""===b?null:b,password:c,confirmPassword:d})}).then(function(a){return a.json()}).then(function(a){console.log(a),a.success?(notificationShow("success",a.success,1e4),window.location.href="/login"):a.error&&notificationShow("warning",a.error,1e4)}).catch(function(a){return console.log(a)})},authRecover=function(){var a=document.querySelector("#email").value,b=document.querySelector(".auth-success");b.innerHTML="If the email is in the database we'll send a recover email!",setTimeout(function(){return window.location.href="/login"},1500)},authLogout=function(){fetch("/api/auth/logout",{method:"POST",credentials:"include"}).then(function(a){return a.json()}).then(function(a){return console.log(a)}).catch(function(a){return console.log(a)})};
"use strict";// comment functions
var commentMinMax=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".comment-reply");"none"!==b.style.display&&b.style.display?b.style.display="none":(b.style.display="block",b.querySelector(".input-textarea").focus())},commentCollapse=function(){var a=event.currentTarget.parentNode.parentNode.parentNode.parentNode,b=a.querySelector(".comment-info-text-container"),c=a.querySelector(".comment-text-container"),d=a.querySelector(".comment-info-actions-container"),e=a.querySelector(".comment-votes"),f=a.querySelectorAll(".comment-container"),g=a.querySelector(".comment-reply");if("unset"===b.style.fontStyle||!b.style.fontStyle){event.currentTarget.src="/static/assets/icons/plus.svg",b.style.fontStyle="italic",c.style.display="none",d.style.display="none",e.style.display="none",g.style.display="none";for(var h=0;h<f.length;h++)f[h].style.display="none"}else{event.currentTarget.src="/static/assets/icons/minus.svg",b.style.fontStyle="unset",c.style.display="block",d.style.display="flex",e.style.display="flex";for(var i=0;i<f.length;i++)f[i].style.display="block"}},commentReply=function(a,b){console.log(a,b);var c=event.currentTarget.parentNode.parentNode.querySelector("textarea");fetch("http://localhost:8081/api/comment",{method:"POST",body:JSON.stringify({refPost:a,refComment:b,content:c.value})}).then(function(a){return a.json()}).then(function(a){return console.log(a)}).catch(function(a){return console.log(a)});var d=event.currentTarget.parentNode.parentNode.parentNode.parentNode;// append.insertAdjacentHTML("afterend", createCommentText(text.value));
c.value="";var e=d.querySelector(".comment-reply");e.style.display="none",window.location.reload()},commentUpdateSaveState=function(a){var b=event.currentTarget,c=b.parentNode.querySelector("img");fetch("http://localhost:8081/api/save",{method:"POST",body:JSON.stringify({refComment:a})}).then(function(a){return a.json()}).then(function(a){a.success?a.remove?(c.src="/static/assets/icons/star.svg",b.innerHTML="save"):(c.src="/static/assets/icons/starFill.svg",b.innerHTML="unsave"):console.log("Something went wrong")}).catch(function(a){return console.log(a)})},commentUpdateVoteState=function(a,b){var c=event.currentTarget.parentNode.querySelector(".comment-votes-amount");console.log(a,b),fetch("http://localhost:8081/api/vote",{method:"POST",body:JSON.stringify({refComment:b,vote:a})}).then(function(a){return a.json()}).then(function(b){b.remove&&b.success?(c.innerHTML=parseInt(c.innerHTML)-a,c.style.color="black"):b.success&&(c.innerHTML=parseInt(c.innerHTML)+a,c.style.color=1===a?"green":"red"),console.log(b)}).catch(function(a){return console.log(a)})},commentReport=function(){console.log("haha")},commentReplyMain=function(a){var b=event.currentTarget.parentNode.parentNode.querySelector("textarea");// const append = document.querySelector(".reply-container");
// append.insertAdjacentHTML("afterend", createCommentText(text.value));
// THIS IS STUPID
console.log(b.value),fetch("http://localhost:8081/api/comment",{method:"POST",body:JSON.stringify({refPost:a,refComment:null,content:b.value})}).then(function(a){return a.json()}).then(function(a){return console.log(a)}).catch(function(a){return console.log(a)}),b.value="",window.location.reload()},commentEdit=function(){var a=event.currentTarget.parentNode.parentNode,b=a.querySelector(".comment-text-container"),c=a.querySelector(".comment-edit");b.style.display="none",c.style.display="block"},commentCancelEdit=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".comment-text-container"),c=a.querySelector(".comment-edit");b.style.display="block",c.style.display="none"},commentSaveEdit=function(a){var b=event.currentTarget.parentNode.parentNode,c=b.querySelector("textarea").value;fetch("http://localhost:8081/api/comment",{method:"PUT",body:JSON.stringify({refComment:a,editedText:c})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():console.log(a)}).catch(function(a){return console.log(a)})},commentDelete=function(){var a=event.currentTarget.parentNode;a.querySelector("#delete").style.display="none",a.querySelector("#delete-confirm").style.display="block",a.querySelector("#delete-cancel").style.display="block"},commentDeleteConfirm=function(a){fetch("http://localhost:8081/api/comment",{method:"DELETE",body:JSON.stringify({refComment:a})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():console.log(a)}).catch(function(a){return console.log(a)})},commentDeleteCancel=function(){var a=event.currentTarget.parentNode;a.querySelector("#delete").style.display="block",a.querySelector("#delete-confirm").style.display="none",a.querySelector("#delete-cancel").style.display="none"};
"use strict";var communityCreate=function(){var a=event.currentTarget.parentNode.parentNode,b=a.querySelector("#name").value,c=a.querySelector("#description").value;fetch("http://localhost:8081/api/community",{method:"POST",body:JSON.stringify({name:b,description:c})}).then(function(a){return a.json()}).then(function(a){a.success&&(window.location.href="/c/".concat(b)),console.log(a)}).catch(function(a){return console.log(a)})},communityEdit=function(){var a=event.currentTarget.parentNode,b=a.querySelector(".meta-description"),c=a.querySelector(".meta-edit");b.style.display="none",c.style.display="block"},communityCancelEdit=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".meta-description"),c=a.querySelector(".meta-edit");b.style.display="block",c.style.display="none"},communitySaveEdit=function(a){var b=event.currentTarget.parentNode.parentNode,c=b.querySelector("textarea").value;fetch("http://localhost:8081/api/community",{method:"PUT",body:JSON.stringify({name:a,editedText:c})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():console.log(a)}).catch(function(a){return console.log(a)})},communitySubscribe=function(a){fetch("http://localhost:8081/api/subscribe",{method:"POST",body:JSON.stringify({name:a})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():notificationShow("error",a.error,1e4)}).catch(function(a){return console.log(a)})};
"use strict";function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(a,b){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}function _arrayWithHoles(a){if(Array.isArray(a))return a}var getQueryFromUrl=function(){return decodeURI(window.location.search).replace("?","").split("&").map(function(a){return a.split("=")}).reduce(function(a,b){var c=_slicedToArray(b,2),d=c[0],e=c[1];return a[d]=e,a},{})},next=function(a){var b=getQueryFromUrl();b.page===void 0||0>=b.page?b.page=1:++b.page,window.location.href="/".concat(a,"?page=").concat(b.page,"&sort=").concat(b.sort?b.sort:"popular")},back=function(a){var b=getQueryFromUrl();b.page===void 0||0>=b.page?b.page=0:--b.page,window.location.href="/".concat(a,"?page=").concat(b.page,"&sort=").concat(b.sort?b.sort:"popular")},getRandomCommunity=function(){fetch("/api/random").then(function(a){return a.json()}).then(function(a){a.error?console.log(a.error):window.location.href="/c/".concat(a.community)}).catch(function(a){return console.log(a)})},setSortMethod=function(){},getSortMethod=function(){};
"use strict";var closing,notificationShow=function(a,b,c){var d=document.querySelector(".notification");d.style.transform="translateY(-72px)";var e=d.querySelector(".notification-type"),f=d.querySelector(".notification-message");switch(a.toLowerCase()){case"error":e.innerHTML="ERROR",d.style.backgroundColor="#F3453E";break;case"warning":e.innerHTML="WARNING",d.style.backgroundColor="#ff904f";break;case"success":e.innerHTML="SUCCESS",d.style.backgroundColor="#10BC10";break;default:}f.innerHTML=b,closing=setTimeout(notificationClose,c)},notificationClose=function(){var a=document.querySelector(".notification");a.style.transform="translateY(72px)",clearTimeout(closing)};
"use strict";// post functions
var postMinMax=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".post-small-preview"),c=a.querySelector(".post-large-preview");"flex"!==b.style.display&&b.style.display?(c.style.display="none",b.style.display="flex",a.querySelector(".post-votes").style.margin="0",event.currentTarget.src="/static/assets/icons/maximize.svg"):(c.style.display="block",b.style.display="none",a.querySelector(".post-votes").style.margin="0 0 auto",event.currentTarget.src="/static/assets/icons/minimize.svg")},postUpdateVoteState=function(a,b){// stupid way to do things!
var c=event.currentTarget.parentNode.querySelector(".post-votes-amount");fetch("http://localhost:8081/api/vote",{method:"POST",body:JSON.stringify({refPost:b,vote:a})}).then(function(a){return a.json()}).then(function(b){b.remove&&b.success?(c.innerHTML=parseInt(c.innerHTML)-a,c.style.color="black"):b.success&&(c.innerHTML=parseInt(c.innerHTML)+a,c.style.color=1===a?"green":"red"),console.log(b)}).catch(function(a){return console.log(a)})},postUpdateSaveState=function(a){var b=event.currentTarget;fetch("http://localhost:8081/api/save",{method:"POST",body:JSON.stringify({refPost:a})}).then(function(a){return a.json()}).then(function(a){a.success?a.remove?b.src="/static/assets/icons/star.svg":b.src="/static/assets/icons/starFill.svg":console.log("Something went wrong")}).catch(function(a){return console.log(a)})},postHide=function(){var a=event.currentTarget.parentNode.parentNode.parentNode.parentNode;a.style.display="none",console.log(a)},postEdit=function(){postMinMax();var a=event.currentTarget.parentNode.parentNode,b=a.querySelector(".post-large-preview"),c=a.querySelector(".post-edit");b.style.display="none",c.style.display="block",console.log(a)},postCancelEdit=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".post-large-preview"),c=a.querySelector(".post-edit");b.style.display="block",c.style.display="none"},postSaveEdit=function(a){var b=event.currentTarget.parentNode.parentNode,c=b.querySelector("textarea").value;fetch("http://localhost:8081/api/post",{method:"PUT",body:JSON.stringify({refPost:a,editedText:c})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():console.log(a)}).catch(function(a){return console.log(a)})},postDelete=function(){var a=event.currentTarget.parentNode;a.querySelector("#delete").style.display="none",a.querySelector("#delete-confirm").style.display="block",a.querySelector("#delete-cancel").style.display="block"},postDeleteConfirm=function(a){fetch("http://localhost:8081/api/post",{method:"DELETE",body:JSON.stringify({refPost:a})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():console.log(a)}).catch(function(a){return console.log(a)})},postDeleteCancel=function(){var a=event.currentTarget.parentNode;a.querySelector("#delete").style.display="block",a.querySelector("#delete-confirm").style.display="none",a.querySelector("#delete-cancel").style.display="none"};
"use strict";document.querySelector("#link-button")&&document.querySelector("#link-button").classList.add("selected");var type="link",changeToText=function(){var a=document.querySelector("#link-button"),b=document.querySelector("#text-button"),c=document.querySelectorAll("input")[2],d=document.querySelector("textarea");c.setAttribute("disabled","disabled"),d.removeAttribute("disabled"),a.classList.remove("selected"),b.classList.add("selected"),type="text"},changeToLink=function(){var a=document.querySelector("#link-button"),b=document.querySelector("#text-button"),c=document.querySelectorAll("input")[2],d=document.querySelector("textarea");c.removeAttribute("disabled"),d.setAttribute("disabled","disabled"),a.classList.add("selected"),b.classList.remove("selected"),type="link"},submitPost=function(a){var b=document.querySelector("#title"),c=document.querySelector("#link"),d=document.querySelector("#content"),e=document.querySelector("#flag");fetch("http://localhost:8081/api/post",{method:"POST",body:JSON.stringify({community:a,title:b.value,link:c.value,content:d.value,type:type,flag:e.value})}).then(function(a){return a.json()}).then(function(b){b.success&&(window.location.href="/c/".concat(a)),console.log(b)}).catch(function(a){return console.log(a)})};
