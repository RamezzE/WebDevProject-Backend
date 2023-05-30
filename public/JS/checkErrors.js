// $(document).ready(function () {
//     $.ajax({
//         url: '/dashboard/products/addProduct',
//         method: 'POST',
//         contentType: 'application/json',
//         success: function (response) {
//             $('.errorMsg').html(response);
//         },
//         error:function(err) {
//             console.log(err);
//         }
//     });

//     $.ajax({
//         url: '/login',
//         method: 'POST',
//         contentType: 'application/json',
//         success: function (response) {
//             $('.errorMsg').html(response);
//         },
//         error:function(err) {
//             console.log(err);
//         }
//     });
// });

$(document).ready(function () {
  $("#form").submit(function (event) {
    event.preventDefault();
    const form = $(this);
    const formData = $(this).serialize();
    $.ajax({
      url: "/login/checkErrors", // Replace with your server-side endpoint
      method: "POST",
      data: formData,
      success: function (response) {
        if (Object.keys(response.errors).length === 0) {
          if (response.admin) window.location.href = "/dashboard";
          else window.location.href = "/account";
        } else {
          $("#emailErrorMsg").html(response.errors.email);
          $("#passwordErrorMsg").html(response.errors.password);
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
});
