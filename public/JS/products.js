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

  let currentURL = window.location.href;
  let newURL = currentURL.replace(/page=\d+/, `page=${pageNum}`);
  window.location.href = newURL;
}


//add submit event listener for form

function submitFilterForm (field) {
  let form = field.parentNode;
  // Perform your desired actions here

  let searchQuery = urlParams.get("query") || '';
  let pageNum = 0;
  let hitsPerPage = urlParams.get("hitsPerPage") || 5;

  let newURL = `/products?query=${searchQuery}&page=${pageNum}&hitsPerPage=${hitsPerPage}`;

  //add filters to url
  let filters = form.querySelectorAll("input");
  filters.forEach((filter) => {
    if (filter.checked) {
      newURL += `&${filter.name}=${filter.value}`;
    }
  });

  window.location.href = newURL;
  
    // //ajax 
  //   $.ajax({
  //     url: newURL, // Replace with your server-side endpoint
  //     method: "GET",
  //     success: function (response) {
  //       console.log(response);

  //     },
  //     error: function (err) {
  //       console.log(err);
  //     },
  //   });
};
