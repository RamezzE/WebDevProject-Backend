class FormClass {
    constructor(form) {
        this.form = form;
        this.noErr = true;
    }
    initialize() {
        document.addEventListener('submit', event => {
            event.preventDefault();
            this.validateFields();
            if (!this.noErr) {
                let errorArr = document.querySelectorAll("#form .errorMsg");
                for (let i = 0; i < errorArr.length; i++) {
                    if (errorArr[i].innerHTML != "") {
                        let lineBreak = errorArr[i].parentElement.getElementsByClassName("lineBreak")[0];
                        errorArr[i].parentElement.removeChild(lineBreak);
                    }
                }
            }
            else
                event.target.submit();
        })
    }
    resetErrors() {
        let errors = document.getElementById("form").getElementsByClassName("errorMsg");
        for (let i = 0; i < errors.length; i++) {
            errors[i].innerHTML = "";
        }
        this.noErr = true;
    }
    validateFields() {
        this.resetErrors();
        let fields = document.querySelectorAll("#form div input");
        if (fields[0].value == "user" && fields[1].value == "user") {
            location.href = "/account";
            return;
        }
        else if (fields[0].value == "admin" && fields[1].value == "admin") {
            location.href = "/dashboard";
            return;
        }

        for (let i = 0; i < fields.length; i++) {
            fields[i].value = fields[i].value.trim();
            if (fields[i].value === "") {
                let error = fields[i].parentElement.getElementsByClassName("errorMsg")[0];
                // error.innerHTML = fields[i].id.concat(" cannot be empty");
                error.innerHTML = "Field cannot be empty";
                error.style.visibility = "visible";
                this.noErr = false;
            }
            else {
                let error = fields[i].parentElement.getElementsByClassName("errorMsg")[0];
                switch (fields[i].id) {
                    case "Password":
                        console.log(fields[i].value.length);
                        if (fields[i].value.length < 8) {
                            error.innerHTML = fields[i].id + " must be more than 8 characters";
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
}

const validator = new FormClass(document.getElementById("form"));
validator.initialize();