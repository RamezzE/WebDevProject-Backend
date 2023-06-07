src =
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js" >
  $(".change").on("click", toggleDarkMode);

function setCookie(cname, cvalue, exdays = 7) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
let dark = getCookie("dark") || "false";
if (dark == "true") {
  toggleDarkMode();
}

$(document).ready(function () {
  if (dark == "true") {
    $("body").addClass("dark");
    $(".row1").addClass("navbar-dark");
    $(".row1").css("color", "white");
    $(".footer").addClass("footer-dark");
    $(".navImg").css("filter", "invert(100%)");
    $(".change").text("☀️");
  }
});

function toggleDarkMode() {
  if ($("body").hasClass("dark")) {
    $("body").removeClass("dark");
    $(".row1").removeClass("navbar-dark");
    $(".row1").css("color", "black");
    $(".footer").removeClass("footer-dark");
    $(".navImg").css("filter", "invert(0%)");
    $(".change").text("🌙");
    setCookie("dark", "false");
    dark = "false";
  } else {
    $("body").addClass("dark");
    $(".row1").addClass("navbar-dark");
    $(".row1").css("color", "white");
    $(".footer").addClass("footer-dark");
    $(".navImg").css("filter", "invert(100%)");
    $(".change").text("☀️");
    setCookie("dark", "true");
    dark = "true";
  }
}
