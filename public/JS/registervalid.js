class FormClass {
    constructor(form) {
        this.form = form;
        this.noErr = true;
    }

    initialize() {
        this.form.addEventListener("submit", (event) => {
          console.log("Registering in user JS");
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
        let fields = document.querySelectorAll("#form div input");

        for (let i = 0; i < fields.length; i++) {
            fields[i].value = fields[i].value.trim();
            let error = document.querySelectorAll("#form .errorMsg")[i];
            if (fields[i].value === "") {
                switch (fields[i].id) {
                    case "firstName":
                        error.innerHTML = "First name is required";
                    break;
                    case "lastName":
                        error.innerHTML = "Last name is required";
                    break;
                    case "Email":
                        error.innerHTML = "Email is required";
                    break;
                    case "Password":
                        error.innerHTML = "Password is required";
                    break;
                    case "ConfirmPass":
                        error.innerHTML = "Confirm password is required";
                    break;
                }
                this.noErr = false;
            }
            else {
                switch (fields[i].id) {
                    case "Password":
                        console.log(fields[i].value.length);
                        if (fields[i].value.length < 8) {
                            error.innerHTML = fields[i].id + " must be more than 8 characters";
                            error.style.visibility = "visible";
                            this.noErr = false;
                        }
                        break;
                    case "ConfirmPass":
                        let pass = document.getElementById("Password");
                        if (pass.value != fields[i].value) {
                            error.innerHTML = "Passwords do not match!";
                            error.style.visibility = "visible";
                            this.noErr = false;
                        }
                        break;
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
        event.preventDefault();
        const formData = $(this.form).serialize();
        $.ajax({
            url: "/register?ajax=true",
            method: "POST",
            data: formData,
            success: function (response) {
            if (Object.keys(response.errors).length === 0)
                window.location.href = "/account";
            else {
                $("#firstNameErrorMsg").html(response.errors.firstName);
                $("#lastNameErrorMsg").html(response.errors.lastName);
                $("#emailErrorMsg").html(response.errors.email);
                $("#passwordErrorMsg").html(response.errors.password);
                $("#confirmPassErrorMsg").html(response.errors.confirmPass);
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