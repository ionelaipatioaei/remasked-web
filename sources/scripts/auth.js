// auth functions
const authLogin = () => {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const warning = document.querySelector(".auth-warning");

  fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({username, password})
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if (data.error) {
      document.querySelector("#password").value = "";
      warning.innerHTML = data.error;
    } else if (data.success) {
      window.location.href = "/";
    }
  })
  .catch(error => console.log(error));
}

const authRegister = () => {
  const username = document.querySelector("#username").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirm-password").value;
  const warning = document.querySelector(".auth-warning");

  fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({username, email: email === "" ? null : email, password, confirmPassword})
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if (data.success) {
      window.location.href = "/login";
    } else if(data.error) {
      warning.innerHTML = data.error;
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