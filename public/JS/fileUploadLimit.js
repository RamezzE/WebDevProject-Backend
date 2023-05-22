var uploadField = document.getElementById("product-upload-input");
var files = [];
var filesToDatabase = [];

uploadField.onchange = function () {
	for (let i = 0; i < this.files.length; i++) {
		if (filesToDatabase.length > 3)
			return;

		if (this.files[i].size > 1000000) {
			alert("File is too big!");
			this.value = "";
			continue;
		};

		filesToDatabase += document.getElementById("product-upload-input").files;
		console.log(i + " " + filesToDatabase[i]);
		
	}
};