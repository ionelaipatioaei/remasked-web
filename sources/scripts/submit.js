if (document.querySelector("#link-button")) {
  document.querySelector("#link-button").classList.add("selected");
}
let type = "link";

const changeToText = () => {
  const linkButton = document.querySelector("#link-button");
  const textButton = document.querySelector("#text-button");
  const linkInput = document.querySelectorAll("input")[2];
  const textInput = document.querySelector("textarea");

  linkInput.setAttribute("disabled", "disabled");
  textInput.removeAttribute("disabled");

  linkButton.classList.remove("selected");
  textButton.classList.add("selected");
  type = "text";
} 

const changeToLink = () => {
  const linkButton = document.querySelector("#link-button");
  const textButton = document.querySelector("#text-button");
  const linkInput = document.querySelectorAll("input")[2];
  const textInput = document.querySelector("textarea");

  linkInput.removeAttribute("disabled");
  textInput.setAttribute("disabled", "disabled");

  linkButton.classList.add("selected");
  textButton.classList.remove("selected");
  type = "link";
}

const submitPost = community => {
  const title = document.querySelector("#title");
  const link = document.querySelector("#link");
  const content = document.querySelector("#content");
  const flag = document.querySelector("#flag");
  const throwaway = document.querySelector("#post-throwaway-checkbox");

  fetch("/api/post", {
    method: "POST",
    body: JSON.stringify({
      community: community,
      title: title.value,
      link: link.value,
      content: content.value,
      type: type,
      flag: flag.value,
      throwaway: throwaway.checked
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        notificationShow("success", data.success, 5000);
        window.location.href = `/c/${community}`;
      } else if (data.error) {
        notificationShow("error", data.error, 5000);
      }
    })
    .catch(error => console.log(error));
}