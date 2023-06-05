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

let currentFilters = "";
let currentPage = urlParams.get("page") || 0;
let searchQuery = urlParams.get("query") || "";

function changePage(pageNum) {
  if (pageNum < 0) return;

  //if page num is same as current page, do nothing
  if (pageNum == currentPage) return;
  
  let newURL = "/products?" + "page=" + pageNum;

  currentPage = pageNum;
  
  newURL += "&query=" + searchQuery;
  newURL += currentFilters;
  console.log(newURL);

  window.location.href = newURL;
  // window.history.pushState({}, "", newURL);
  // ajaxProducts(newURL);
}

//add submit event listener for form

function submitFilterForm(field, page = 0) {
  let form = field.parentNode;
  // Perform your desired actions here

  let searchQuery = urlParams.get("query") || "";
  let pageNum = page;
  currentPage = 0;
  let hitsPerPage = urlParams.get("hitsPerPage") || 5;

  let newURL = `/products?query=${searchQuery}&page=${pageNum}&hitsPerPage=${hitsPerPage}`;

  //add filters to url
  currentFilters = "";
  let filters = form.querySelectorAll("input");
  filters.forEach((filter) => {
    if (filter.checked) {
      currentFilters += `&${filter.name}=${filter.value}`;
    }
  });
  console.log(currentFilters);

  newURL += currentFilters;

  //ajax
  ajaxProducts(newURL + "&ajax=true");

  //update url
  window.history.pushState({}, "", newURL);

  let pageDivs = $(".pagination div");
  pageDivs.removeClass("active");
  pageDivs[page].classList.add("active");

  currentPage = 0;
}

function ajaxProducts(URL) {
  $.ajax({
    url: URL, // Replace with your server-side endpoint
    method: "GET",
    success: function (response) {
      console.log(response);
      // Update the DOM here
      let products = response.products;

      let productsGrid = $(".productsGrid");
      productsGrid.empty();

      $.each(products, function (index, product) {
        var productDiv = $("<div>")
          .addClass("product")
          .mouseenter(function () {
            TogglePhoto(this);
          })
          .mouseleave(function () {
            TogglePhoto(this);
          });

        var productLink = $("<a>").attr(
          "href",
          "/products/" + product.objectID
        );

        var img1 = $("<img>").attr(
          "src",
          "../Images/Products/" + product.images[0]
        );
        var img2 = $("<img>")
          .attr("src", "../Images/Products/" + product.images[1])
          .hide();

        productLink.append(img1, img2);

        var nameSpan = $("<span>").text(product.name).css("margin-top", "auto");
        var priceSpan = $("<span>")
          .addClass("price")
          .text(product.price + " EGP");

        productDiv.append(productLink, nameSpan, priceSpan);
        productsGrid.append(productDiv);
      });

      //update pagination
      let pagination = $(".pagination");
      pagination.empty();
      
      if (response.totalPages == 1)
        return;
      
      for (let i = 0; i < response.totalPages; i++) {
        var pageLink = $("<div>")
          .attr("onclick", "changePage(" + i + ")")
          .append(
            $("<a>")
              .attr("href", "#")
              .text(i + 1)
          );
        pagination.append(pageLink);
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
}

$(document).ready(function () {
  // Function x
  updateCheckBoxes();
  currentFilters = "";
  let form = document.querySelector("#filter-form-overlay a").parentNode;
  let filters = form.querySelectorAll("input");
  filters.forEach((filter) => {
    if (filter.checked) 
      currentFilters += `&${filter.name}=${filter.value}`;
  });
  if (searchQuery != "") 
    document.getElementsByClassName("searchBox")[0].value = searchQuery;

  let pageDivs = $(".pagination div");
  pageDivs[currentPage].classList.add("currentPage");

  console.log(currentFilters);
});

function updateCheckBoxes() {
  let form = document.querySelector("#filter-form-overlay a").parentNode;

  let checkboxes = form.querySelectorAll("input[type='checkbox']");

  let count = 0;

  checkboxes.forEach(function (checkbox) {
    let checkboxName = checkbox.name;

    // Check if the checkbox name exists as a URL parameter
    if (urlParams.has(checkboxName)) {
      var checkboxValue = urlParams.get(checkboxName);

      if (checkboxValue === "on") checkbox.checked = true;
      else checkbox.checked = false;
    } else {
      checkbox.checked = false;
      count++;
    }
  });

  if (count == checkboxes.length) {
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = true;
    });
  }
}
