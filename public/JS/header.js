let menuIcons = document.getElementsByClassName("menuIcon");
let searchImg = document.getElementById("searchImg");
let searchSpan = document.getElementsByClassName("searchSpan")[0];
let searchBox = document.getElementsByClassName("searchBox")[0];
let closeSearch = document.getElementById("closeSearch");

function toggleMenu() {
  let x = document.getElementsByClassName("menuItem");
  for (let i = 0; i < x.length; i++) {
    if (x[i].style.display == "block") x[i].style.display = "none";
    else x[i].style.display = "block";
  }
}

searchBox.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) 
    toggleSearchBar(true);
});

function onLoad() {
  if (window.innerWidth <= 600)
    searchBox.style.display = "none";
  else 
    searchBox.style.display = "inline";
}
window.onload = onLoad;

window.onresize = function() {
  if (window.innerWidth <= 600) { 
    if (!isSearchBoxFocused())
      searchBox.style.display = "none";
  }
  else 
    searchBox.style.display = "inline";
  
}

function toggleSearchBar(bool) {
  let value;
  if (bool) {
    if (searchBox.style.display == "none") {
      value = "none";
      searchSpan.style.marginLeft = "0";
      searchSpan.style.display = "inline";
      searchImg.style.marginLeft = "0";
      searchBox.style.width = "100%";
      searchSpan.style.width = "70%";
      searchBox.style.display = "inline";
    } else {

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

    
  } else {
    value = "";
    searchSpan.style.marginLeft = "auto";
    searchBox.style.display = "none";
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

function isSearchBoxFocused() {
  return document.activeElement === document.getElementsByClassName("searchBox")[0];
}

