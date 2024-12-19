const links = document.querySelector("#links");
const userName = document.querySelector("#user");
const logOutBtn = document.querySelector("#logout");
const welcome = document.querySelector("#welcome");

if (localStorage.getItem("logged-in") === "true") {
  logOutBtn.style.display = "block";
}

logOutBtn.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.setItem("logged-in", "false");
  setTimeout(() => {
    window.location = "login.html";
  }, 1000);
  setTimeout(() => {
    links.style.display = "flex";
    userInfo.style.display = "none";
  }, 2000);
});
