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

function changePage(pageNum) {
  if (pageNum < 0) return;
  
  //if page num is same as current page, do nothing
  if (pageNum == urlParams.get("page")) return;

  let form = document.createElement("form");
  form.action = "/products";
  form.method = "GET";

  let input = document.createElement("input");
  input.type = "hidden";
  input.name = "page";
  input.value = pageNum;
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
