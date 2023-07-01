//https://www.uuidgenerator.net/
app_id = "17070e64-d90f-4853-8c4a-bed87b358f71"


user = null;
temp_login = null;
server = null;
function login() {
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    server = document.getElementById("server").value;
    temp_login = {
        "type":"login",
        "email":email,
        "password": password
    }
    login_connect();
    /*
    user = {
        "email": email,
        "server": server,
        "token": null
    };
    localStorage.setItem(app_id + "user", JSON.stringify(user));
    */

    console.log(user);
}

if (is_login_exists()) {
    console.log("Démarrage");
    user = localStorage.getItem(app_id + "user", user);

    try{
        user = JSON.parse(user);
    } catch (error) {
        console.log("Données utilisateur corrompu");
        localStorage.removeItem(app_id + "user");
        login_renderer();
    }
} else {
    console.log("Login nécesssaire");
    login_renderer();
}

function is_login_exists() {
    // Vérifier si l'objet app_id_user existe dans le localstorage
    if (localStorage.getItem(app_id + "user")) {
        console.log("L'objet app_id_user existe dans le localstorage.");
        return true;
    } else {
        console.log("L'objet app_id_user n'existe pas dans le localstorage.");
        return false;
    }
}

function login_connect() {
    const rws = new ReconnectingWebSocket("wss://" + server);
    rws.addEventListener('open', () => {
        rws.send(JSON.stringify(temp_login));
    });
}

function renderer() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                    change_theme_icon();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}

function login_renderer() {
    element = document.getElementById("login_page");
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) { element.innerHTML = this.responseText; }
        }
    }
    xhttp.open("GET", "components/login.html", true);
    xhttp.send();
}


