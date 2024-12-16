const links = document.querySelector("#links");
const userInfo = document.querySelector("#user_info");
const userName = document.querySelector("#user");
const logOutBtn = document.querySelector("#logout");

if (localStorage.getItem("logged-in") === "true") {
  userInfo.style.display = "flex";
  welcome.innerHTML = `Welcome ${localStorage.getItem("fisrtName")}`;
}

logOutBtn.addEventListener("click", function () {
  // localStorage.clear();
  localStorage.setItem("logged-in", "false");
  setTimeout(() => {
    window.location = "login.html";
  }, 1000);
  setTimeout(() => {
    links.style.display = "flex";
    userInfo.style.display = "none";
  }, 2000);
});
