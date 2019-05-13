let closing;
const notificationShow = (type, messageText, duration) => {
  const notification = document.querySelector(".notification");
  notification.style.display = "block";
  // it needs a delay in order for the notification to have a animation
  setTimeout(() => notification.style.transform = "translateY(-72px)", 50);
  const showType = notification.querySelector(".notification-type");
  const message = notification.querySelector(".notification-message");
  
  switch(type.toLowerCase()) {
    case "error":
    showType.innerHTML = "ERROR";
    notification.style.backgroundColor = "#F3453E";
    break;
    case "warning":
    showType.innerHTML = "WARNING";
    notification.style.backgroundColor = "#ff904f";
    break;
    case "success":
    showType.innerHTML = "SUCCESS";
    notification.style.backgroundColor = "#10BC10";
    break;
    default:
    break;
  }
  
  message.innerHTML = messageText;
  
  closing = setTimeout(notificationClose, duration);
}

const notificationClose = () => {
  const notification = document.querySelector(".notification");
  notification.style.transform = "translateY(72px)";
  // set the display to none to hide it from the bottom of the webpage
  setTimeout(() => notification.style.display = "none", 300);
  clearTimeout(closing);
}