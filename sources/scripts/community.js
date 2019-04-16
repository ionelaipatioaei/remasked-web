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
      }
      console.log(data);
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
  const main = event.currentTarget.parentNode.parentNode;
  const editedText = main.querySelector("textarea").value;

  fetch("http://localhost:8081/api/community", {
    method: "PUT",
    body: JSON.stringify({
      name: name,
      editedText: editedText     
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.reload();
      } else {
        console.log(data);
      }
    })
    .catch(error => console.log(error));
}

const communitySubscribe = (name) => {
  fetch("http://localhost:8081/api/subscribe", {
    method: "POST",
    body: JSON.stringify({
      name: name   
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.reload();
      } else {
        console.log(data);
      }
    })
    .catch(error => console.log(error));
}