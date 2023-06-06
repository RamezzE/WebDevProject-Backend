let urlParams = new URLSearchParams(window.location.search);
let currentPage = urlParams.get("page") || 0;
let searchQuery = urlParams.get("query") || "";
if (searchQuery != "")
    document.getElementsByClassName("search-box")[0].value = searchQuery;
//add listener for form submit

let adminForm = document.querySelector("#admin-form-overlay");

adminForm.addEventListener("submit", function (e) {
  e.preventDefault();
  submitAdminForm(adminForm.querySelector("a"));
});

let deleteForm = document.querySelector("#user-form-overlay");

deleteForm.addEventListener("submit", function (e) {
  e.preventDefault();
  submitDeleteForm(deleteForm.querySelector("a"));
});

const searchBox = document.getElementsByClassName('search-box')[0];

searchBox.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) 
    searchUsers();
});

function onLoad() {
  if (searchQuery != "")
    document.getElementsByClassName("search-box")[0].value = searchQuery;

  let pageDivs = $(".pagination div");
  pageDivs[currentPage].classList.add("currentPage");
}

$(document).ready(onLoad);
window.onLoad = onLoad;

function submitAdminForm(field) {
  let form = field.parentNode;

  let formURL = form.action;

  formURL += `?ajax=true`;
  console.log(formURL);
  ajaxAdminUser(form, formURL);
}

function ajaxAdminUser(form, URL) {
  let msg = $("#admin-form-overlay .msg");
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

function submitDeleteForm(field) {
  let form = field.parentNode;

  let formURL = form.action;

  formURL += `?ajax=true`;

  ajaxDeleteUser(form, formURL);
}

function ajaxDeleteUser(form, URL) {
  let msg = $("#user-form-overlay .msg");
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

function searchUsers() {
  let form = document.createElement("form");
  form.action = "/dashboard/users";
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

function submitFilterForm(field, page = 0) {
  let form = field.parentNode;
  // Perform your desired actions here

  let searchQuery = urlParams.get("query") || "";
  let pageNum = page;
  let hitsPerPage = urlParams.get("hitsPerPage") || 5;

  //sort by createdAt

  let newURL = `/dashboard/users?query=${searchQuery}&page=${pageNum}&hitsPerPage=${hitsPerPage}`;

  //add filters to url
  let filters = form.querySelectorAll("input");
  filters.forEach((filter) => {
    if (filter.checked) newURL += `&${filter.name}=${filter.value}`;
  });

  // window.location.href = newURL;
  if (!urlParams.get("ajax"));
  newURL += "&ajax=true";
  console.log(newURL);

  //ajax
  ajaxUsers(newURL);
}

function ajaxUsers(URL) {
  $.ajax({
    url: URL, // Replace with your server-side endpoint
    method: "GET",
    success: function (response) {
      let users = response.users;

      let usersTable = $("#usersTable");
      usersTable.empty();
      // Generate the table dynamically
      var headerRow = $("<tr></tr>");

      headerRow.append("<th>Name</th>");
      headerRow.append("<th>Email</th>");
      headerRow.append("<th>Type</th>");
      headerRow.append("<th>ID</th>");

      usersTable.append(headerRow);

      $.each(users, function (index, user) {
        var row = $("<tr></tr>");
        var nameCell = $("<td></td>").text(user.name);
        var emailCell = $("<td></td>").text(user.email);
        var typeCell = $("<td></td>").text(user.userType);
        var idCell = $("<td></td>", {
          class: "valueToCopy",
          text: user.objectID,
        });
        var buttonCell = $("<td></td>").append(
          $("<button></button>", {
            onclick: "copyToClipboard(this, 'valueToCopy')",
          }).append(
            $("<img />", {
              src: "../Images/Dashboard/copy.png",
              style: "width:20px;height:20px;",
            })
          )
        );

        row.append(nameCell);
        row.append(emailCell);
        row.append(typeCell);
        row.append(idCell);
        row.append(buttonCell);
        usersTable.append(row);
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

function changePage(pageNum) {
  if (pageNum < 0) return;

  //if page num is same as current page, do nothing
  if (pageNum == currentPage) return;
  
  let newURL = "/dashboard/users?" + "page=" + pageNum;

  currentPage = pageNum;
  
  newURL += "&query=" + searchQuery;
  console.log(newURL);

  window.location.href = newURL;

  // window.location.href = newURL;
}
