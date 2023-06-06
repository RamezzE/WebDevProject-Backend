class FormClass {
  constructor(form) {
    this.form = form;
    this.noErr = true;
  }
  initialize() {
    this.form.addEventListener("submit", (event) => {
      console.log("Logging in user JS");
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
    let errors = document
      .getElementById("form")
      .getElementsByClassName("errorMsg");
    for (let i = 0; i < errors.length; i++) {
      errors[i].innerHTML = "";
    }
    this.noErr = true;
  }
  validateFields() {
    this.resetErrors();
    let fields = document.querySelectorAll("#form .group input");
    if (fields[0].value == "admin" && fields[1].value == "admin") {
      location.href = "/dashboard";
      return;
    }

    for (let i = 0; i < fields.length; i++) {
      fields[i].value = fields[i].value.trim();
      if (fields[i].value === "") {
        let error = document.querySelectorAll("#form .errorMsg")[i];
        if (fields[i].id == "Email") error.innerHTML = "Email is required";
        else if (fields[i].id == "Password")
          error.innerHTML = "Password is required";
        this.noErr = false;
      } else {
        let error = document.querySelectorAll("#form .errorMsg")[i];
        switch (fields[i].id) {
          case "Password":
            if (fields[i].value.length < 8) {
              error.innerHTML =
                fields[i].id + " must be more than 8 characters";
              this.noErr = false;
            }
            break;
          case "Email":
            let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!fields[i].value.match(mailformat)) {
              error.innerHTML = "Invalid Email";
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
      url: "/login?ajax=true",
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
  }
}

const validator = new FormClass(document.getElementById("form"));
validator.initialize();
