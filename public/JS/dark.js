

src=
"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js">
    

    
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

$( ".change" ).on("click", function() {
  if( $( "body" ).hasClass( "dark" )) {
      $( "body" ).removeClass( "dark" );
      $(".row1").removeClass("navbar-dark");
      $(".row1").css("color", "black")
    $( ".change" ).text( "🌙" );
  } else {
      $( "body" ).addClass( "dark" );
      $(".row1").addClass("navbar-dark");
      $(".row1").css("color", "white")

   $( ".change" ).text( "☀️" );
  }
});