class FormClass {
    constructor(form) {
        this.form = form;
        this.noErr = true;
    }

    initialize() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            console.log("Checkout user JS");
          this.validateFields();
          if (!this.noErr) {
            event.preventDefault();
          } else {
            // Call the jQuery AJAX function
            this.submitFormWithAjax(event);
          }
        });
      }

    resetErrors() {
        let errors = document.getElementById("form").getElementsByClassName("errorMsg");
        for (let i = 0; i < errors.length; i++) {
            errors[i].innerHTML = "<br>";
        }
        this.noErr = true;
    }
    validateFields() {
        this.resetErrors();
        let fields = document.getElementsByClassName("check");

        for (let i = 0; i < fields.length; i++) {
            fields[i].value = fields[i].value.trim();
            let error = document.querySelectorAll("#form .errorMsg")[i];
            if (fields[i].value === "") {
                switch (fields[i].id) {
                    case "fname":
                        error.innerHTML = "Name is required";
                    break;
                    case "address":
                        error.innerHTML = "Address is required";
                    break;
                    case "email":
                        error.innerHTML = "Email is required";
                    break;
                    case "cardnumber":
                        error.innerHTML = "Cardnumber is required";
                    break;
                }
                this.noErr = false;
            }
            else {
                switch (fields[i].id) {
                    case "Email":
                        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                        if (!fields[i].value.match(mailformat)) {
                            error.innerHTML = "Invalid Email";
                            error.style.visibility = "visible";
                            this.noErr = false;
                        }
                        break;
                }
            }
        }

    }

    submitFormWithAjax(event) {
        console.log("d5lna ajax");
        event.preventDefault();
        const formData = $(this.form).serialize();
        $.ajax({
            url: "/checkout?ajax=true",
            method: "POST",
            data: formData,
            success: function (response) {
            if (Object.keys(response.errors).length === 0)
                window.location.href = "/Myproducts";
            else {
                $("#fullNameErrorMsg").html(response.errors.fullname);
                $("#AdressErrorMsg").html(response.errors.address);
                $("#emailErrorMsg").html(response.errors.email);
                $("#CardErrorMsg").html(response.errors.cardnumber);
            }
            },
            error: function (err) {
            console.log(err);
            },
        });
    }
}

const validator = new FormClass(document.getElementById("form"));
validator.initialize();