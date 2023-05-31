function submitFilterForm(field, page = 0) {
  let form = field.parentNode;
  // Perform your desired actions here

  let searchQuery = urlParams.get("query") || "";
  let pageNum = page;
  let hitsPerPage = urlParams.get("hitsPerPage") || 5;

  let newURL = `/dashboard/products?query=${searchQuery}&page=${pageNum}&hitsPerPage=${hitsPerPage}`;

  //add filters to url
  let filters = form.querySelectorAll("input");
  filters.forEach((filter) => {
    if (filter.checked) {
      newURL += `&${filter.name}=${filter.value}`;
    }
  });

  // window.location.href = newURL;
  if (!urlParams.get("ajax"));
  newURL += "&ajax=true";

  //ajax
  DashboardAjaxProducts(newURL);
}

function DashboardAjaxProducts(URL) {
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
