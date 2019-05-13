const communityCreate = () => {
  const main = event.currentTarget.parentNode.parentNode;
  const name = main.querySelector("#name").value;
  const description = main.querySelector("#description").value;
  
  fetch("http://localhost:8081/api/community", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      description: description
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = `/c/${name}`;
        notificationShow("success", data.success, 10000);  
      } else {
        notificationShow("error", data.error, 10000);  
      }
    })
    .catch(error => console.log(error));
}

const communityEdit = () => {
  const main = event.currentTarget.parentNode;
  const content = main.querySelector(".meta-description");
  const edit = main.querySelector(".meta-edit");

  content.style.display = "none";
  edit.style.display = "block";
}

const communityCancelEdit = () => {
  const main = event.currentTarget.parentNode.parentNode.parentNode;
  const content = main.querySelector(".meta-description");
  const edit = main.querySelector(".meta-edit");

  content.style.display = "block";
  edit.style.display = "none";
}

const communitySaveEdit = (name) => {
  const main = event.currentTarget.parentNode.parentNode.parentNode;
  const editedText = main.querySelector("textarea").value;
  const edit = main.querySelector(".meta-edit");
  const description = main.querySelector(".meta-description");
  fetch("http://localhost:8081/api/community", {
    method: "PUT",
    body: JSON.stringify({
      name: name,
      editedText: editedText     
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        description.innerHTML = editedText;

        description.style.display = "block";
        edit.style.display = "none";
      } else if (data.error) {
        notificationShow("error", data.error, 5000);
      }
    })
    .catch(error => console.log(error));
}

const communitySubscribe = (name) => {
  const main = event.currentTarget.parentNode.parentNode;
  const button = main.querySelector("#meta-subscribe");
  const label = button.querySelector(".button-label");
  const subscribers = main.querySelector("#meta-subscribers-count");

  console.log(button, subscribers);

  fetch("http://localhost:8081/api/subscribe", {
    method: "POST",
    body: JSON.stringify({
      name: name   
    })
  }).then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        if (!data.remove) {
          label.innerHTML = "Unsubscribe";
          subscribers.innerHTML = parseInt(subscribers.innerHTML) + 1;
        } else {
          label.innerHTML = "Subscribe";
          subscribers.innerHTML = parseInt(subscribers.innerHTML) - 1;
        }
      } else if (data.error) {
        notificationShow("error", data.error, 5000);
      }
    })
    .catch(error => console.log(error));
}