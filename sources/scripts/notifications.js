let closing;

const notificationShow = (type, messageText, duration) => {
  const notification = document.querySelector(".notification");
  notification.style.transform = "translateY(-72px)";
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
  clearTimeout(closing);
}