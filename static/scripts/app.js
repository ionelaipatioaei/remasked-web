"use strict";// auth functions
var authLogin=function(){var a=document.querySelector("#username").value,b=document.querySelector("#password").value;fetch("/api/auth/login",{method:"POST",body:JSON.stringify({username:a,password:b})}).then(function(a){return a.json()}).then(function(a){a.success?(notificationShow("success",a.success,1e4),window.location.href="/"):a.error&&(document.querySelector("#password").value="",notificationShow("error",a.error,1e4))}).catch(function(a){return console.log(a)})},authRegister=function(){var a=document.querySelector("#username").value,b=document.querySelector("#password").value,c=document.querySelector("#confirm-password").value,d=document.querySelector("#auth-user-agrees");// const email = document.querySelector("#email").value;
d.checked?fetch("/api/auth/register",{method:"POST",body:JSON.stringify({username:a,password:b,confirmPassword:c})}).then(function(a){return a.json()}).then(function(a){a.success?(notificationShow("success",a.success,1e4),window.location.href="/login"):a.error&&notificationShow("warning",a.error,1e4)}).catch(function(a){return console.log(a)}):notificationShow("error","Please read and agree with our Terms of Use and Privacy Policy.",1e4)},authRecover=function(){document.querySelector("#email").value;notificationShow("error","This function isn't implemented.",5e3),setTimeout(function(){return window.location.href="/login"},1500)},authLogout=function(){fetch("/api/auth/logout",{method:"POST"}).then(function(a){return a.json()}).then(function(a){console.log(a)}).catch(function(a){return console.log(a)})},passwordInput=document.querySelector("#password");passwordInput&&passwordInput.addEventListener("keydown",function(a){13===a.keyCode&&authLogin()});
"use strict";// comment functions
var commentMinMax=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".comment-reply");"none"!==b.style.display&&b.style.display?b.style.display="none":(b.style.display="block",b.querySelector(".input-textarea").focus())},commentCollapse=function(){var a=event.currentTarget.parentNode.parentNode.parentNode.parentNode,b=a.querySelector(".comment-info-text-container"),c=a.querySelector(".comment-text-container"),d=a.querySelector(".comment-info-actions-container"),e=a.querySelector(".comment-votes"),f=a.querySelectorAll(".comment-container"),g=a.querySelector(".comment-reply");if("unset"===b.style.fontStyle||!b.style.fontStyle){event.currentTarget.src="/static/assets/icons/plus.svg",b.style.fontStyle="italic",c.style.display="none",d.style.display="none",e.style.display="none",g.style.display="none";for(var h=0;h<f.length;h++)f[h].style.display="none"}else{event.currentTarget.src="/static/assets/icons/minus.svg",b.style.fontStyle="unset",c.style.display="block",d.style.display="flex",e.style.display="flex";for(var i=0;i<f.length;i++)f[i].style.display="block"}},commentReply=function(a,b){var c=event.currentTarget.parentNode.parentNode.querySelector("textarea"),d=event.currentTarget.parentNode.parentNode.querySelector("#comment-throwaway-checkbox");fetch("/api/comment",{method:"POST",body:JSON.stringify({refPost:a,refComment:b,content:c.value,throwaway:d.checked})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},commentUpdateSaveState=function(a){var b=event.currentTarget,c=b.parentNode.querySelector("img");fetch("/api/save",{method:"POST",body:JSON.stringify({refComment:a})}).then(function(a){return a.json()}).then(function(a){a.success?a.remove?(c.src="/static/assets/icons/star.svg",b.innerHTML="save"):(c.src="/static/assets/icons/starFill.svg",b.innerHTML="unsave"):a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},commentUpdateVoteState=function(a,b){var c=event.currentTarget.parentNode.querySelector(".comment-votes-amount"),d=c.parentNode.querySelector("#comment-upvote"),e=c.parentNode.querySelector("#comment-downvote");console.log(a,b),fetch("/api/vote",{method:"POST",body:JSON.stringify({refComment:b,vote:a})}).then(function(a){return a.json()}).then(function(b){b.remove&&b.success?(c.innerHTML=parseInt(c.innerHTML)+-a,c.style.color="black",d.src="/static/assets/icons/up.svg",e.src="/static/assets/icons/down.svg"):b.success?(c.innerHTML=-1===a&&"rgb(16, 188, 16)"==c.style.color?parseInt(c.innerHTML)-2:1===a&&"rgb(243, 69, 62)"==c.style.color?parseInt(c.innerHTML)+2:parseInt(c.innerHTML)+a,c.style.color=1===a?"#10bc10":"#f3453e",1===a?(d.src="/static/assets/icons/up-use.svg",e.src="/static/assets/icons/down.svg"):(d.src="/static/assets/icons/up.svg",e.src="/static/assets/icons/down-use.svg")):b.error&&notificationShow("error",b.error,5e3)}).catch(function(a){return console.log(a)})},commentReport=function(){console.log("work in progress...")},commentReplyMain=function(a){var b=event.currentTarget.parentNode.parentNode.querySelector("textarea"),c=event.currentTarget.parentNode.parentNode.querySelector("#comment-throwaway-checkbox");fetch("/api/comment",{method:"POST",body:JSON.stringify({refPost:a,refComment:null,content:b.value,throwaway:c.checked})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},commentEdit=function(){var a=event.currentTarget.parentNode.parentNode,b=a.querySelector(".comment-text-container"),c=a.querySelector(".comment-edit");b.style.display="none",c.style.display="block"},commentCancelEdit=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".comment-text-container"),c=a.querySelector(".comment-edit");b.style.display="block",c.style.display="none"},commentSaveEdit=function(a,b){var c=event.currentTarget.parentNode.parentNode,d=c.querySelector("textarea").value;fetch("/api/comment",{method:"PUT",body:JSON.stringify({refComment:a,refPost:b,editedText:d})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},commentDelete=function(){var a=event.currentTarget.parentNode;a.querySelector("#delete").style.display="none",a.querySelector("#delete-confirm").style.display="block",a.querySelector("#delete-cancel").style.display="block"},commentDeleteConfirm=function(a,b){fetch("/api/comment",{method:"DELETE",body:JSON.stringify({refComment:a,refPost:b})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},commentDeleteCancel=function(){var a=event.currentTarget.parentNode;a.querySelector("#delete").style.display="block",a.querySelector("#delete-confirm").style.display="none",a.querySelector("#delete-cancel").style.display="none"},commentThrowaway=function(){var a=event.currentTarget.parentNode;a.querySelector("#throwaway").style.display="none",a.querySelector("#throwaway-confirm").style.display="block",a.querySelector("#throwaway-cancel").style.display="block"},commentThrowawayConfirm=function(a){fetch("/api/throwaway",{method:"POST",body:JSON.stringify({refComment:a})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},commentThrowawayCancel=function(){var a=event.currentTarget.parentNode;a.querySelector("#throwaway").style.display="block",a.querySelector("#throwaway-confirm").style.display="none",a.querySelector("#throwaway-cancel").style.display="none"};
"use strict";var communityCreate=function(){var a=event.currentTarget.parentNode.parentNode,b=a.querySelector("#name").value,c=a.querySelector("#description").value;fetch("/api/community",{method:"POST",body:JSON.stringify({name:b,description:c})}).then(function(a){return a.json()}).then(function(a){a.success?(window.location.href="/c/".concat(b),notificationShow("success",a.success,1e4)):notificationShow("error",a.error,1e4)}).catch(function(a){return console.log(a)})},communityEdit=function(){var a=event.currentTarget.parentNode,b=a.querySelector(".meta-description"),c=a.querySelector(".meta-edit");b.style.display="none",c.style.display="block"},communityCancelEdit=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".meta-description"),c=a.querySelector(".meta-edit");b.style.display="block",c.style.display="none"},communitySaveEdit=function(a){var b=event.currentTarget.parentNode.parentNode.parentNode,c=b.querySelector("textarea").value,d=b.querySelector(".meta-edit"),e=b.querySelector(".meta-description");fetch("/api/community",{method:"PUT",body:JSON.stringify({name:a,editedText:c})}).then(function(a){return a.json()}).then(function(a){a.success?(e.innerHTML=c,e.style.display="block",d.style.display="none"):a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},communitySubscribe=function(a){var b=event.currentTarget.parentNode.parentNode,c=b.querySelector("#meta-subscribe"),d=c.querySelector(".button-label"),e=b.querySelector("#meta-subscribers-count");console.log(c,e),fetch("/api/subscribe",{method:"POST",body:JSON.stringify({name:a})}).then(function(a){return a.json()}).then(function(a){console.log(a),a.success?a.remove?(d.innerHTML="Subscribe",e.innerHTML=parseInt(e.innerHTML)-1):(d.innerHTML="Unsubscribe",e.innerHTML=parseInt(e.innerHTML)+1):a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})};
"use strict";function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(a,b){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}function _arrayWithHoles(a){if(Array.isArray(a))return a}var getQueryFromUrl=function(){return decodeURI(window.location.search).replace("?","").split("&").map(function(a){return a.split("=")}).reduce(function(a,b){var c=_slicedToArray(b,2),d=c[0],e=c[1];return a[d]=e,a},{})},next=function(a){var b=getQueryFromUrl();b.page===void 0||0>=b.page?b.page=1:++b.page,window.location.href="/".concat(a,"?page=").concat(b.page,"&sort=").concat(b.sort?b.sort:"popular")},back=function(a){var b=getQueryFromUrl();b.page===void 0||0>=b.page?b.page=0:--b.page,window.location.href="/".concat(a,"?page=").concat(b.page,"&sort=").concat(b.sort?b.sort:"popular")},getRandomCommunity=function(){fetch("/api/random").then(function(a){return a.json()}).then(function(a){a.community?window.location.href="/c/".concat(a.community):a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},setSortMethod=function(){},getSortMethod=function(){};
"use strict";var closing,notificationShow=function(a,b,c){var d=document.querySelector(".notification");d.style.display="block",setTimeout(function(){return d.style.transform="translateY(-72px)"},50);var e=d.querySelector(".notification-type"),f=d.querySelector(".notification-message");switch(a.toLowerCase()){case"error":e.innerHTML="ERROR",d.style.backgroundColor="#F3453E";break;case"warning":e.innerHTML="WARNING",d.style.backgroundColor="#ff904f";break;case"success":e.innerHTML="SUCCESS",d.style.backgroundColor="#10BC10";break;default:}f.innerHTML=b,closing=setTimeout(notificationClose,c)},notificationClose=function(){var a=document.querySelector(".notification");// set the display to none to hide it from the bottom of the webpage
a.style.transform="translateY(72px)",setTimeout(function(){return a.style.display="none"},300),clearTimeout(closing)};
"use strict";var optionsShow=function(){document.querySelector(".options").style.display="block",document.querySelector(".global-container").style.filter="blur(8px)",document.querySelector("nav").style.filter="blur(8px)",document.querySelector("footer").style.filter="blur(8px)",document.querySelector(".notification").style.filter="blur(8px)"},optionsClose=function(){document.querySelector(".options").style.display="none",document.querySelector(".global-container").style.filter="",document.querySelector("nav").style.filter="",document.querySelector("footer").style.filter="",document.querySelector(".notification").style.filter=""};
"use strict";// post functions
var postMinMax=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".post-small-preview"),c=a.querySelector(".post-large-preview");"flex"!==b.style.display&&b.style.display?(c.style.display="none",b.style.display="flex",a.querySelector(".post-votes").style.margin="0",event.currentTarget.src="/static/assets/icons/maximize.svg"):(c.style.display="block",b.style.display="none",a.querySelector(".post-votes").style.margin="0 0 auto",event.currentTarget.src="/static/assets/icons/minimize.svg")},postUpdateVoteState=function(a,b){var c=event.currentTarget.parentNode.querySelector(".post-votes-amount"),d=c.parentNode.querySelector("#post-upvote"),e=c.parentNode.querySelector("#post-downvote");fetch("/api/vote",{method:"POST",body:JSON.stringify({refPost:b,vote:a})}).then(function(a){return a.json()}).then(function(b){b.remove&&b.success?(c.innerHTML=parseInt(c.innerHTML)+-a,c.style.color="black",d.src="/static/assets/icons/up.svg",e.src="/static/assets/icons/down.svg"):b.success?(c.innerHTML=-1===a&&"rgb(16, 188, 16)"==c.style.color?parseInt(c.innerHTML)-2:1===a&&"rgb(243, 69, 62)"==c.style.color?parseInt(c.innerHTML)+2:parseInt(c.innerHTML)+a,c.style.color=1===a?"#10bc10":"#f3453e",1===a?(d.src="/static/assets/icons/up-use.svg",e.src="/static/assets/icons/down.svg"):(d.src="/static/assets/icons/up.svg",e.src="/static/assets/icons/down-use.svg")):b.error&&notificationShow("error",b.error,3e3)}).catch(function(a){return console.log(a)})},postUpdateSaveState=function(a){var b=event.currentTarget;fetch("/api/save",{method:"POST",body:JSON.stringify({refPost:a})}).then(function(a){return a.json()}).then(function(a){a.success?a.remove?b.src="/static/assets/icons/star.svg":b.src="/static/assets/icons/starFill.svg":a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},postHide=function(){var a=event.currentTarget.parentNode.parentNode.parentNode.parentNode;a.style.display="none"},postEdit=function(){postMinMax();var a=event.currentTarget.parentNode.parentNode,b=a.querySelector(".post-large-preview"),c=a.querySelector(".post-edit");b.style.display="none",c.style.display="block"},postCancelEdit=function(){var a=event.currentTarget.parentNode.parentNode.parentNode,b=a.querySelector(".post-large-preview"),c=a.querySelector(".post-edit");b.style.display="block",c.style.display="none"},postSaveEdit=function(a){var b=event.currentTarget.parentNode.parentNode,c=b.querySelector("textarea").value;fetch("/api/post",{method:"PUT",body:JSON.stringify({refPost:a,editedText:c})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},postDelete=function(){var a=event.currentTarget.parentNode;a.querySelector("#delete").style.display="none",a.querySelector("#delete-confirm").style.display="block",a.querySelector("#delete-cancel").style.display="block"},postDeleteConfirm=function(a){fetch("/api/post",{method:"DELETE",body:JSON.stringify({refPost:a})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},postDeleteCancel=function(){var a=event.currentTarget.parentNode;a.querySelector("#delete").style.display="block",a.querySelector("#delete-confirm").style.display="none",a.querySelector("#delete-cancel").style.display="none"},postThrowaway=function(){var a=event.currentTarget.parentNode;a.querySelector("#throwaway").style.display="none",a.querySelector("#throwaway-confirm").style.display="block",a.querySelector("#throwaway-cancel").style.display="block"},postThrowawayConfirm=function(a){fetch("/api/throwaway",{method:"POST",body:JSON.stringify({refPost:a})}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},postThrowawayCancel=function(){var a=event.currentTarget.parentNode;a.querySelector("#throwaway").style.display="block",a.querySelector("#throwaway-confirm").style.display="none",a.querySelector("#throwaway-cancel").style.display="none"};
"use strict";var settingsDeleteAccount=function(){var a=document.querySelector("#settings-delete-account");a.style.display="none";var b=document.querySelector("#settings-delete-account-container");b.style.display="flex"},settingsDeleteAccountConfirm=function(){var a=document.querySelector("#settings-delete-account-password"),b=document.querySelector("#settings-keep-username");fetch("/api/auth/delete",{method:"POST",body:JSON.stringify({password:a.value,keepUsername:b.checked})}).then(function(a){return a.json()}).then(function(a){a.success?(notificationShow("success",a.success,5e3),window.location.href="/"):a.error&&notificationShow("error",a.error,5e3)}).catch(function(a){return console.log(a)})},settingsDeleteAccountCancel=function(){var a=document.querySelector("#settings-delete-account");a.style.display="block";var b=document.querySelector("#settings-delete-account-container");b.style.display="none"};
"use strict";document.querySelector("#link-button")&&document.querySelector("#link-button").classList.add("selected");var type="link",changeToText=function(){var a=document.querySelector("#link-button"),b=document.querySelector("#text-button"),c=document.querySelectorAll("input")[2],d=document.querySelector("textarea");c.setAttribute("disabled","disabled"),d.removeAttribute("disabled"),a.classList.remove("selected"),b.classList.add("selected"),type="text"},changeToLink=function(){var a=document.querySelector("#link-button"),b=document.querySelector("#text-button"),c=document.querySelectorAll("input")[2],d=document.querySelector("textarea");c.removeAttribute("disabled"),d.setAttribute("disabled","disabled"),a.classList.add("selected"),b.classList.remove("selected"),type="link"},submitPost=function(a){var b=document.querySelector("#title"),c=document.querySelector("#link"),d=document.querySelector("#content"),e=document.querySelector("#flag"),f=document.querySelector("#post-throwaway-checkbox");fetch("/api/post",{method:"POST",body:JSON.stringify({community:a,title:b.value,link:c.value,content:d.value,type:type,flag:e.value,throwaway:f.checked})}).then(function(a){return a.json()}).then(function(b){b.success?(notificationShow("success",b.success,5e3),window.location.href="/c/".concat(a)):b.error&&notificationShow("error",b.error,5e3)}).catch(function(a){return console.log(a)})};
