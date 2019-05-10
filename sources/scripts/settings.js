const settingsDeleteAccount = () => {
  const main = document.querySelector("#settings-delete-account");
  main.style.display = "none";
  
  const container = document.querySelector("#settings-delete-account-container");
  container.style.display = "flex";
}

const settingsDeleteAccountConfirm = () => {
  const password = document.querySelector("#settings-delete-account-password");
  const keep = document.querySelector("#settings-keep-username");

  console.log(password.value, keep.checked);

  fetch("http://localhost:8081/api/auth/delete", {
    method: "POST",
    body: JSON.stringify({
      password: password.value,
      keepUsername: keep.checked
    })
  }).then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = "/";
        notificationShow("success", data.success, 10000);  
      } else {
        notificationShow("error", data.error, 5000);  
      }
    })
    .catch(error => console.log(error));
}

const settingsDeleteAccountCancel = () => {
  const main = document.querySelector("#settings-delete-account");
  main.style.display = "block";

  const container = document.querySelector("#settings-delete-account-container");
  container.style.display = "none";
}