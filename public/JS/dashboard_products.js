let urlParams = new URLSearchParams(window.location.search);

let deleteForm = document.querySelector("#delete-product-overlay");
let currentPage = urlParams.get("page") || 0;
let currentFilters = "";

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

function ajaxAddProduct(form, URL) {
  console.log("In ajaxAddProduct function");
  console.log("form: ", form);

  const msg = document.querySelectorAll("#product-form-overlay .errorMsg");
  for (let i = 0; i < msg.length; i++) msg[i].innerHTML = "";

  var formData = new FormData(form);

  console.log(formData);

  $.ajax({
    url: URL,
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    enctype: "multipart/form-data",
    success: function (response) {
      if (Object.keys(response.errorMsg).length === 0) {
        setTimeout(function () {
          location.reload();
        }, 2000);
      } else {
        $("#productNameError").html(response.errorMsg.productName);
        $("#productPriceError").html(response.errorMsg.productPrice);
        $("#productDescriptionError").html(
          response.errorMsg.productDescription
        );
        $("#productStockError").html(response.errorMsg.productStock);
        $("#productImageError").html(response.errorMsg.images);
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
          
        if (response.fetchedFields.tags.includes('man'))
          $("#edit-men-checkbox").prop("checked", true);
        
        if (response.fetchedFields.tags.includes('woman'))
          $("#edit-women-checkbox").prop("checked", true);

        if (response.fetchedFields.tags.includes('kid'))
          $("#edit-kids-checkbox").prop("checked", true);

        if (response.fetchedFields.tags.includes('shoe'))
          $("#edit-shoes-checkbox").prop("checked", true);

        else if (response.fetchedFields.tags.includes('bag'))
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
      if (!response.errorMsg) {
        $("#edit-p").css("display", "none");
        $("#productIDDiv").css("display", "none");
        $("#save-button").css("display", "none");
        $("#cancel-form").css("display", "none");
        toggleDivs(false);
        $("#success-span").html(response.successMsg);
        setTimeout(function () {
          location.reload();
        }, 2000);
      } else {
        console.log("In ajax returned error");
        console.log(response.errorMsg.productID);
        $("#productNameError").html(response.errorMsg.productName);
        $("#productPriceError").html(response.errorMsg.productPrice);
        $("#productDescriptionError").html(
          response.errorMsg.productDescription
        );
        $("#productStockError").html(response.errorMsg.productStock);



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

      if (response.totalPages == 1) return;

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
  toggleDivs(false);

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
