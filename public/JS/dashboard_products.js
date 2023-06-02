let urlParams = new URLSearchParams(window.location.search);

let deleteForm = document.querySelector("#delete-product-overlay");
let currentPage = urlParams.get("page") || 0;
let currentFilters = "";

deleteForm.addEventListener("submit", function (e) {
  e.preventDefault();
  submitDeleteProductForm(deleteForm.querySelector("a"));
});

function submitDeleteProductForm(field) {
  let form = field.parentNode;

  let formURL = form.getAttribute("action");

  formURL += `?ajax=true`;
  console.log(formURL);
  formURL = "/dashboard/products/delete?ajax=true";

  //timeout to allow the overlay to close
  setTimeout(ajaxDeleteProduct(form, formURL), 250);
}

function ajaxDeleteProduct(form, URL) {
  let msg = $("#delete-product-overlay .msg");
  msg.empty();
  const formData = $(form).serialize();
  $.ajax({
    url: URL, // Replace with your server-side endpoint
    method: "POST",
    data: formData,
    success: function (response) {
      if (!response.msg) {
        if (response.error) {
          let error = response.error;
          msg.append(error);
          return;
        }
      }

      msg.append(response.msg);

      //refresh page from here
      setTimeout(function () {
        location.reload();
      }, 2000);
    },
    error: function (err) {
      console.log(err);
    },
  });
}

function submitFilterForm(field, page = 0) {
  let form = field.parentNode;
  // Perform your desired actions here

  let searchQuery = urlParams.get("query") || "";
  let pageNum = page;
  currentPage = 0;
  let hitsPerPage = urlParams.get("hitsPerPage") || 5;

  let newURL = `/dashboard/products?query=${searchQuery}&page=${pageNum}&hitsPerPage=${hitsPerPage}`;

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
      let products = response.products;

      let productsTable = $("#productsTable");
      productsTable.empty();
      // Generate the table dynamically
      var headerRow = $("<tr></tr>");

      headerRow.append("<th></th>");
      headerRow.append("<th>Name</th>");
      headerRow.append("<th>Price</th>");
      headerRow.append("<th>Stock</th>");
      headerRow.append("<th>ID</th>");

      productsTable.append(headerRow);

      $.each(products, function (index, product) {
        var row = $("<tr></tr>");
        var imgCell = $("<td></td>").append(
          $("<img />", {
            src: "../../Images/Products/" + product.images[0],
          })
        );
        var nameCell = $("<td></td>").text(product.name);
        var priceCell = $("<td></td>").text(product.price);
        var stockCell = $("<td></td>").text(product.stock);
        var idCell = $("<td></td>", {
          class: "valueToCopy",
          text: product.objectID,
        });
        var buttonCell = $("<td></td>").append(
          $("<button></button>", {
            onclick: "copyToClipboard(this,'valueToCopy')",
          }).append(
            $("<img />", {
              src: "../../Images/Dashboard/copy.png",
              style: "width:20px;height:20px;",
            })
          )
        );

        row.append(imgCell);
        row.append(nameCell);
        row.append(priceCell);
        row.append(stockCell);
        row.append(idCell);
        row.append(buttonCell);

        productsTable.append(row);
      });

      //paging
      let pagination = $(".pagination");
      pagination.empty();

      if (response.totalPages == 1) 
        return;

      for (let i = 0; i < response.totalPages; i++) {
        var pageLink = $("<div>")
          .attr("onclick", "changePage(" + i + ")")
          .append(
            $("<a>")
              .attr("href", "")
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
  updateCheckBoxes();
  // submitFilterForm(document.querySelector("#filter-form-overlay a", currentPage));
  currentFilters = "";
  let form = document.querySelector("#filter-form-overlay a").parentNode;
  let filters = form.querySelectorAll("input");
  filters.forEach((filter) => {
    if (filter.checked) {
      currentFilters += `&${filter.name}=${filter.value}`;
    }
  });
  console.log(currentFilters);

});

function updateCheckBoxes() {
  // Get the URL parameters
  let urlParams = new URLSearchParams(window.location.search);

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

function changePage(pageNum) {
  if (pageNum < 0) return;

  //if page num is same as current page, do nothing
  if (pageNum == currentPage) return;
  
  let newURL = "/dashboard/products?" + "page=" + pageNum;

  currentPage = pageNum;
  newURL += currentFilters;
  console.log(newURL);

  window.location.href = newURL;
  window.history.pushState({}, "", newURL);
  // ajaxProducts(newURL);
}
