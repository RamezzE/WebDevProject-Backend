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

$(document).ready(function() {
    $('#form').submit(function(event) {
      event.preventDefault();
  
      // Get form data
      var formData = $(this).serialize();
  
        $.ajax({
            url: '/login', // Replace with your server-side endpoint
            method: 'POST',
            data: formData,
            success: function(response) {
            // Check if there are any errors
            if (response.errors && response.errors.email) {
                // Display the error message in the error span
                $('.errorMsg').text(response.errors.email);
            }
            },
            error: function(err) {
            console.log(err);
            }
        });
    });
});