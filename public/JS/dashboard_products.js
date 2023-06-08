let urlParams = new URLSearchParams(window.location.search);

let deleteForm = document.querySelector("#delete-product-overlay");
let currentPage = urlParams.get("page") || 0;
let currentFilters = "";
let searchQuery = urlParams.get("query") || "";

if (searchQuery != "")
  document.getElementsByClassName("search-box")[0].value = searchQuery;

let addForm = document.getElementById("addProductForm");

let editForm = document.getElementById("editProductForm");

deleteForm.addEventListener("submit", function (e) {
  e.preventDefault();
  submitDeleteProductForm(deleteForm.querySelector("a"));
});

addForm.addEventListener("submit", function (e) {
  e.preventDefault();
  submitAddProductForm(addForm.querySelector("a"));
});

editForm.addEventListener("submit", function (e) {
  e.preventDefault();
  submitEditProductForm(editForm.querySelector("a"));
});

const searchBox = document.getElementsByClassName("search-box")[0];

searchBox.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) searchProducts();
});

function onLoad() {
  if (searchQuery != "")
    document.getElementsByClassName("search-box")[0].value = searchQuery;

  toggleDivs(false);

  updateCheckBoxes();

  currentFilters = "";
  let form = document.querySelector("#filter-form-overlay a").parentNode;
  let filters = form.querySelectorAll("input");
  filters.forEach((filter) => {
    if (filter.checked) currentFilters += `&${filter.name}=${filter.value}`;
  });
  console.log(currentFilters);

  let pageDivs = $(".pagination div");
  pageDivs[currentPage].classList.add("currentPage");
}

$(document).ready(onLoad);
window.onLoad = onLoad;

function submitDeleteProductForm(field) {
  let form = field.parentNode;

  let formURL = form.getAttribute("action");

  formURL += `?ajax=true`;
  console.log(formURL);
  formURL = "/dashboard/products/delete?ajax=true";

  //timeout to allow the overlay to close
  setTimeout(ajaxDeleteProduct(form, formURL), 250);
}

function submitEditProductForm(field) {
  let form = field.parentNode;
  let formURL = "/dashboard/products/editProduct?ajax=true";

  // Timeout to allow the overlay to close
  setTimeout(ajaxEditProduct(form, formURL), 250);
}

function submitAddProductForm(field) {
  let form = field.parentNode;
  let formURL = "/dashboard/products/addProduct?ajax=true";

  // Timeout to allow the overlay to close
  setTimeout(ajaxAddProduct(form, formURL), 250);

  // send img to server
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

function searchProducts() {
  let form = document.createElement("form");
  form.action = "/dashboard/products";
  form.method = "GET";
  let input = document.createElement("input");
  input.type = "hidden";
  input.name = "query";

  let searchSpan = document.querySelector(".searchSpan");
  input.value = searchSpan.querySelector("input").value;

  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
}

function ajaxAddProduct(form, URL) {
  console.log("In ajaxAddProduct function");
  console.log("form: ", form);

  const msg = document.querySelectorAll("#product-form-overlay .errorMsg");
  for (let i = 0; i < msg.length; i++) msg[i].innerHTML = "";

  var formData = new FormData(form);

  console.log(formData);

  document.getElementById("product-shoes-checkbox").onchange = function () {
    if (this.checked) {
      document.getElementById("product-bags-checkbox").checked = false;
    } else {
      document.getElementById("product-bags-checkbox").checked = true;
    }
  };

  $.ajax({
    url: URL,
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    enctype: "multipart/form-data",
    success: function (response) {
      if (!response.errorMsg) {
        console.log("Success");
        $("#product-form-overlay #success-span").html(
          "Successfully Added Product"
        );
        //hide all divs
        let divs = form.querySelectorAll("#addProductForm > div");
        for (let i = 0; i < divs.length; i++) divs[i].style.display = "none";
        document.querySelectorAll("#product-form-overlay p")[1].style.display =
          "none";
        document.querySelectorAll("#product-form-overlay a")[0].style.display =
          "none";
        //refresh page from here
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      } else {
        $("#product-form-overlay #productNameError").html(response.errorMsg.productName);
        $("#product-form-overlay #productPriceError").html(response.errorMsg.productPrice);
        $("#product-form-overlay #productDescriptionError").html(
          response.errorMsg.productDescription
        );

        $("#edit-product-overlay #targetAudienceError").html(response.errorMsg.targetAudience);

        $("#edit-product-overlay #typeError").html(response.errorMsg.productType);

        $("#product-form-overlay #productStockError").html(response.errorMsg.productStock);
        $("#product-form-overlay #productImageError").html(response.errorMsg.images);
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
}

function toggleDivs(bool) {
  let toggle = "";
  if (bool) toggle = "flex";
  else toggle = "none";
  let divs = document.querySelectorAll("#edit-product-overlay .form-item-div");

  for (let i = 1; i < divs.length; i++) divs[i].style.display = toggle;

  let checkboxDiv = document.querySelectorAll(
    "#edit-product-overlay .product-form-checkbox-div"
  );
  for (let i = 0; i < checkboxDiv.length; i++) {
    checkboxDiv[i].style.display = toggle;
  }
}

function submitCheckProductIDForm(field) {
  let form = field.parentNode;
  let formURL = "/dashboard/products/checkProductID?ajax=true";
  setTimeout(ajaxCheckProductID(form, formURL), 250);
}

function ajaxCheckProductID(form, URL) {
  console.log("In ajaxCheckProductID function");

  const formData = $(form).serialize();

  const msg = document.querySelectorAll("#edit-product-overlay .errorMsg");
  for (let i = 0; i < msg.length; i++) {
    msg[i].innerHTML = "";
  }

  $.ajax({
    url: URL,
    method: "POST",
    data: formData,
    success: function (response) {
      if (!response.errorMsg) {
        console.log("Fetched fields: ", response.fetchedFields);
        $("#edit-product-overlay .form-item-div label").css("top", "-30px");
        $("#edit-p").html("Edit Product");
        $("#productIDDiv").css("display", "none");
        $("#edit-button").css("display", "none");
        $("#save-button").css("display", "inline-block");
        $("input").prop("disabled", false);
        $("textarea").prop("disabled", false);
        $("#productName").attr("value", response.fetchedFields.productName);
        $("#productPrice").attr("value", response.fetchedFields.productPrice);
        $("#productDescription").html(
          response.fetchedFields.productDescription
        );
        $("#productStock").attr("value", response.fetchedFields.productStock);
        toggleDivs(true);

        if (response.fetchedFields.tags.includes("man"))
          $("#edit-men-checkbox").prop("checked", true);

        if (response.fetchedFields.tags.includes("woman"))
          $("#edit-women-checkbox").prop("checked", true);

        if (response.fetchedFields.tags.includes("kid"))
          $("#edit-kids-checkbox").prop("checked", true);

        if (response.fetchedFields.tags.includes("shoe"))
          $("#edit-shoes-checkbox").prop("checked", true);
        else if (response.fetchedFields.tags.includes("bag"))
          $("#edit-bags-checkbox").prop("checked", true);
      } else {
        console.log("In ajax returned error");
        console.log(response.errorMsg.productID);
        $("#productIDError").html(response.errorMsg.productID);
      }
    },
    error: function (err) {
      msg[0].innerHTML = "Invalid product ID";
      console.log(err);
    },
  });
}

function ajaxEditProduct(form, URL) {
  console.log("In ajaxEditProduct function");

  const formData = new FormData(form);

  const msg = document.querySelectorAll("#edit-product-overlay .errorMsg");
  for (let i = 0; i < msg.length; i++) {
    msg[i].innerHTML = "";
  }

  $.ajax({
    url: URL,
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    enctype: "multipart/form-data",
    success: function (response) {
      console.log(response.errorMsg);
      if (!response.errorMsg) {
        $("#edit-p").css("display", "none");
        $("#save-button").css("display", "none");
        $("#cancel-form").css("display", "none");
        toggleDivs(false);
        $("#editProductForm #success-span").html(response.successMsg);
        setTimeout(function () {
          location.reload();
        }, 2000);
      } else {
        console.log("In ajax returned error");

        $("#edit-product-overlay #productNameError").html(response.errorMsg.productName);

        $("#edit-product-overlay #productPriceError").html(response.errorMsg.productPrice);

        $("#edit-product-overlay #productDescriptionError").html(
          response.errorMsg.productDescription
        );

        $("#edit-product-overlay #targetAudienceError").html(response.errorMsg.targetAudience);
          
        $("#edit-product-overlay #typeError").html(response.errorMsg.productType);

        $("#edit-product-overlay #productStockError").html(response.errorMsg.productStock);

        $("#edit-product-overlay #productImageError").html(response.errorMsg.images);
      }
    },
    error: function (err) {
      msg[0].innerHTML = "Invalid product ID";
      console.log(err);
    },
  });

  // matensash dol ya dodo lama el validation yeb2a tamam 3ashan te-reset el buttons
  // $("#edit-button").css('display', 'none');
  // $("#save-button").css('display', 'flex');
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
    if (filter.checked) currentFilters += `&${filter.name}=${filter.value}`;
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
        imgCell.attr(
          "onclick",
          "window.location.href = '/products/" + product.objectID + "'"
        );
        imgCell.css("cursor", "pointer");
          
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

      if (response.totalPages == 1) return;

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

function toggleShoes() {
  let addShoes = document.getElementById("product-shoes-checkbox");
  let addBags = document.getElementById("product-bags-checkbox");

  let editShoes = document.getElementById("edit-shoes-checkbox");
  let editBags = document.getElementById("edit-bags-checkbox");

  if (addShoes.checked) addBags.checked = false;
  else addBags.checked = true;

  if (editShoes.checked) editBags.checked = false;
  else editBags.checked = true;
}

function toggleBags() {
  let addBags = document.getElementById("product-bags-checkbox");
  let addShoes = document.getElementById("product-shoes-checkbox");

  let editBags = document.getElementById("edit-bags-checkbox");
  let editShoes = document.getElementById("edit-shoes-checkbox");

  if (addBags.checked) addShoes.checked = false;
  else addShoes.checked = true;

  if (editBags.checked) editShoes.checked = false;
  else editShoes.checked = true;
}

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

  newURL += "&query=" + searchQuery;
  newURL += currentFilters;
  console.log(newURL);

  window.location.href = newURL;
  // ajaxProducts(newURL);
}
