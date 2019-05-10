// auth functions
const authLogin = () => {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({username, password})
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if (data.error) {
      document.querySelector("#password").value = "";
      // warning.innerHTML = data.error;
      notificationShow("error", data.error, 10000);
    } else if (data.success) {
      notificationShow("success", data.success, 10000);
      window.location.href = "/";
    }
  })
  .catch(error => console.log(error));
}

const authRegister = () => {
  const username = document.querySelector("#username").value;
  // const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirm-password").value;

  fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({username, password, confirmPassword})
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if (data.success) {
      notificationShow("success", data.success, 10000);
      window.location.href = "/login";
    } else if(data.error) {
      notificationShow("warning", data.error, 10000);
    }
  })
  .catch(error => console.log(error));
}

const authRecover = () => {
  const email = document.querySelector("#email").value;
  const success = document.querySelector(".auth-success");

  success.innerHTML = "If the email is in the database we'll send a recover email!"
  setTimeout(() => window.location.href = "/login", 1500);
}

const authLogout = () => {
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => console.log(error));
}

// checks to see if enter is pressed when the user enters a password
const passwordInput = document.querySelector("#password");
if (passwordInput) {
  passwordInput.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) authLogin();
  });
}
// this one line also looks cool
// if (passwordInput) passwordInput.addEventListener("keydown", e => e.keyCode === 13 ? authLogin() : null);
