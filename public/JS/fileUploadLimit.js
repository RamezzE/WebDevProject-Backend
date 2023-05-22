var uploadField = document.getElementById("product-upload-input");

var files = document.getElementById("product-upload-input").files;

uploadField.onchange = function() {
	console.log(files);
    if(this.files[0].size > 3000000){
       alert("File is too big!");
       this.value = "";
    };
};