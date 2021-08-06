


let loginPage = document.querySelector(".login-container");
let registerForm = document.querySelector("#register-form");
let loginForm = document.querySelector("#login-form");

function register(){
    let form = new FormData(registerForm);

    fetch("http://localhost:5000/register", {
        method: 'POST', // or 'PUT'
        body: form,
    })
}




function login(){

    let form = new FormData(loginForm);
    fetch(`http://localhost:5000/login`, {
        method: 'POST', // or 'PUT'
            body: form,
            })
}


