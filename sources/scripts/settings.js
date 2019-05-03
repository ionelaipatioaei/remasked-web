const settingsDeleteAccount = () => {
  const main = document.querySelector("#settings-delete-account");
  main.style.display = "none";
  
  const container = document.querySelector("#settings-delete-account-container");
  container.style.display = "flex";
}

const settingsDeleteAccountConfirm = () => {

}

const settingsDeleteAccountCancel = () => {
  const main = document.querySelector("#settings-delete-account");
  main.style.display = "block";

  const container = document.querySelector("#settings-delete-account-container");
  container.style.display = "none";
}