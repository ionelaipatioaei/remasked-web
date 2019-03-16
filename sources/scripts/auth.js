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

  fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({username, email: email === "" ? null : email, password, confirmPassword})
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if (data.success) {
      window.location.href = "/login";
    }
  })
  .catch(error => console.log(error));
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