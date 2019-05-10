const optionsShow = () => {
  document.querySelector(".options").style.display = "block";
  document.querySelector(".global-container").style.filter = "blur(8px)";
  document.querySelector("nav").style.filter = "blur(8px)";
  document.querySelector("footer").style.filter = "blur(8px)";
  document.querySelector(".notification").style.filter = "blur(8px)";
}

const optionsClose = () => {
  document.querySelector(".options").style.display = "none";
  document.querySelector(".global-container").style.filter = "";
  document.querySelector("nav").style.filter = "";
  document.querySelector("footer").style.filter = "";
  document.querySelector(".notification").style.filter = "";
}