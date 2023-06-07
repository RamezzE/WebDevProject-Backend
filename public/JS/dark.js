// const urlParams = new URLSearchParams(window.location.search);
// if (urlParams.get("dark")) {
//   dark = true;
// }
// else {
//   dark = false;
// }

// window.onLoad = function () {
//   if (dark) {
//     $("body").addClass("dark");
//     $(".row1").addClass("navbar-dark");
//     $(".row1").css("color", "white")
//     $(".footer").addClass("footer-dark");
//     $(".navImg").css("filter", "invert(100%)");
//     $(".change").text("☀️");
//   }
// }

src =
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js" >



  //    function toogledark(bool){
  //if (bool){
  //  $( ".change" ).on("click", function(bool) {
  //    if( bool==true) {
  //      bool=false;
  //       } else if (bool==false){
  //     bool=true;
  //        }
  //   });
  //if (bool){
  //   $( "body" ).removeClass( "dark" );
  //   $( ".change" ).text( "🌙" );
  //   } 
  //    else $( "body" ).addClass( "dark" );
  //   $( ".change" ).text( "☀️" );
  //}
  //}




  // $( ".change" ).on("click", function() {
  //     if( $( "body" ).hasClass( "dark" )) {
  //         $( "body" ).removeClass( "dark" );
  //       $( ".change" ).text( "🌙" );
  //     } else {
  //         $( "body" ).addClass( "dark" );
  //      $( ".change" ).text( "☀️" );
  //     }
  // });



  $(".change").on("click", toggleDarkMode);

function toggleDarkMode() {
  if ($("body").hasClass("dark")) {
    $("body").removeClass("dark");
    $(".row1").removeClass("navbar-dark");
    $(".row1").css("color", "black")
    $(".footer").removeClass("footer-dark");
    $(".navImg").css("filter", "invert(0%)");
    $(".change").text("🌙");

    // dark = false;
    // let newURL;
    // if (window.location.href.includes("&dark"))
    //   newURL = window.location.href.replace("&dark=$(dark)", "");
    // else
    //   newURL = window.location.href + "&dark=" + dark;

    // window.history.pushState({}, "", newURL);

  } else {
    $("body").addClass("dark");
    $(".row1").addClass("navbar-dark");
    $(".row1").css("color", "white")
    $(".footer").addClass("footer-dark");
    $(".navImg").css("filter", "invert(100%)");
    $(".change").text("☀️");
    // dark = true;
    // let newURL;
    // if (window.location.href.includes("&dark"))
    //   newURL = window.location.href.replace("&dark=$(dark)", "");
    // else
    //   newURL = window.location.href + "&dark=" + dark;

    // window.history.pushState({}, "", newURL);
  }
}