function TogglePhoto(field) {
  let imgs = field.getElementsByTagName("img");
  if (imgs[0].style.display == "none") {
    imgs[0].style.display = "block";
    imgs[1].style.display = "none";
    return;
  }
  
  imgs[0].style.display = "none";
  imgs[1].style.display = "block";
}

const urlParams = new URLSearchParams(window.location.search);

function changePage(num) {
  let page = urlParams.get("page");
  if (!page) page = 0;

  if (num > 0) page = parseInt(page) + 1;
  else page = parseInt(page) - 1;

  let form = document.createElement("form");
  form.action = "/products";
  form.method = "GET";

  let input = document.createElement("input");
  input.type = "hidden";
  input.name = "page";
  input.value = page;
  form.appendChild(input);

  let searchQuery = urlParams.get("query");
  input = document.createElement("input");
  input.type = "hidden";
  input.name = "query";
  input.value = searchQuery;
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
}
