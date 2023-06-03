function toggleMenu() {
  let x = document.getElementsByClassName("menuItem");
  for (let i = 0; i < x.length; i++) {
    if (x[i].style.display == "block") x[i].style.display = "none";
    else x[i].style.display = "block";
  }
}

let menuIcons = document.getElementsByClassName("menuIcon");
let searchImg = document.getElementById("searchImg");
let searchSpan = document.getElementsByClassName("searchSpan")[0];
let searchBox = document.getElementsByClassName("searchBox")[0];
let closeSearch = document.getElementById("closeSearch");

function toggleSearchBar(bool) {
  let value;
  if (bool) {
    if (searchSpan.style.display == "inline") {
        let form = document.createElement("form");
        form.action = "/products";
        form.method = "GET";
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = "query";
        input.value = searchSpan.querySelector("input").value;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        return;
    }

    value = "none";
    searchSpan.style.marginLeft = "0";
    searchSpan.style.display = "inline";
    searchImg.style.marginLeft = "0";
    searchBox.style.width = "100%";
    searchSpan.style.width = "70%";
  } else {
    value = "";
    searchSpan.style.marginLeft = "auto";
    searchSpan.style.display = "none";
    searchImg.style.marginLeft = "auto";
    searchBox.style.width = "unset";
    searchSpan.style.width = "unset";
  }

  for (let i = 0; i < menuIcons.length; i++) {
    menuIcons[i].style.display = value;
  }

  if (bool) closeSearch.style.display = "";
  else closeSearch.style.display = "none";

  searchImg.style.display = "";
}
const options = {
  bottom: '32px', // default: '32px'
  right: 'unset', // default: '32px'
  left: '32px', // default: 'unset'
  time: '0.5s', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '#fff',  // default: '#fff'
  buttonColorDark: '#100f2c',  // default: '#100f2c'
  buttonColorLight: '#fff', // default: '#fff'
  saveInCookies: false, // default: true,
  label: '🌓', // default: ''
  autoMatchOsTheme: true // default: true
}
 
const darkmode = new Darkmode(options);
darkmode.showWidget();
