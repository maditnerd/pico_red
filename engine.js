//https://www.uuidgenerator.net/
//Afin de différencier les applications dans le cas où elles seraient hébergés
//sur le même serveur

// Déclaration de l'identifiant de l'application
app_id = "17070e64-d90f-4853-8c4a-bed87b358f71"

// Récupération de l'utilisateur à partir du stockage local
user = localStorage.getItem(app_id + "user");
// Récupération du serveur à partir du stockage local
server = localStorage.getItem(app_id + "server");

// Variable temporaire pour stocker les informations de connexion
temp_login = null;

function loading() {
    var bar = new ldBar(".ldBar", {
        "value": 100,
        "stroke-width": 0
    });
}
loading();

function login() {
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    server = document.getElementById("server").value;
    temp_login = {
        "type": "login",
        "email": email,
        "password": password
    }
    login();
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

function show_loading() {
    document.getElementById("loading_screen").style.visibility = "visible";
}
function hide_loading() {
    document.getElementById("loading_screen").style.visibility = "hidden";
}


if (server_exists()) {
    console.log("🖲️ Server 🆗");

    if (login_exists()) {
        console.log("🧔‍♂️ User 🆗")
        connect();
    } else {
        console.log("🧔‍♂️ User ❌")
        renderer("login");
    }
} else {
    console.log("🖲️ Server ❌")
    renderer("server");
}

function reset_server() {
    localStorage.removeItem(app_id + "server");
    location.reload();
}

function check_connect(server) {
    console.log(server);
    pattern = /^([a-zA-Z0-9]+\.)*[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (pattern.test(server)) {
        show_loading();
        const socket = new WebSocket("wss://" + server);
        socket.onopen = function () {
            hide_loading();
            console.log("Connexion OK")
            socket.close();
            localStorage.setItem(app_id + "server", server);
            location.reload();
        }
        socket.onerror = function () {
            hide_loading();
            swal("Connexion échoué", "Etes vous sûr de l'avoir bien tapé ?", "error");
            socket.close();
        }
    } else {
        console.log("Adresse invalide");
        swal("Adresse Invalide", "", "error");
    }
}

function login_exists() {
    // Vérifier si l'objet user existe dans le localstorage
    if (localStorage.getItem(app_id + "user")) {
        return true;
    } else {
        return false;
    }
}

function server_exists() {
    // Vérifier si l'objet user existe dans le localstorage
    if (localStorage.getItem(app_id + "server")) {
        return true;
    } else {
        return false;
    }
}

function websocket_receiver(event) {
    console.log(event.data);
}

function login_connect() {
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    check_login(email, password)


}

function connect() {
    const rws = new ReconnectingWebSocket("wss://" + server);
    rws.addEventListener('open', () => {
    });
    rws.onmessage = receive;
}

function resetlogin() {
    localStorage.removeItem(app_id + "user");
}

function check_login(email, password) {
    pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (pattern.test(email)) {
        const socket = new WebSocket("wss://" + server);
        show_loading();
        socket.onopen = function () {
            console.log("Connexion OK")
            login_obj = {
                "type": "login",
                "email": email,
                "password": password
            }
            socket.send(JSON.stringify(login_obj));
            console.log(login_obj);
        }
        socket.onmessage = function (event) {
            hide_loading();
            console.log(event.data);
            try {
                json_token = JSON.parse(event.data);
            } catch (error) {
                swal("Login échoué", "Le serveur a répondu une réponse incorrecte", "error");
                socket.close();
                return;
            }
            switch (json_token.status) {
                case "success":
                    token = {
                        token: json_token.token,
                        email: email
                    };
                    localStorage.setItem(app_id + "user", JSON.stringify(token));
                    socket.close();
                    location.reload();
                    break;
                case "not_found":
                    swal("Utilisateur inconnu", "Email inccorect", "error");
                    break;
                case "failed":
                    swal("Mot de passe incorrect", "", "error");
                    break;
                default:
                    swal("Login échoué", "Erreur inconnu...", "", "error");
                    break;
            }


        }
        socket.onerror = function () {
            hide_loading();
            swal("Connexion échoué", "Le serveur marche pas 😭😭😭😿😿😿😭😭😭", "error");
            socket.close();
        }
    } else {
        console.log("Email invalide");
        swal("Email Invalide!", "", "error");
    }
}

function mass_renderer() {
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

function renderer(id) {
    element = document.getElementById(id);
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) { element.innerHTML = this.responseText; }
        }
    }
    xhttp.open("GET", "components/" + id + ".html", true);
    xhttp.send();
}

function renderer_to(id, page, with_script=false) {
    element = document.getElementById(id);
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) { element.innerHTML = this.responseText; }
        }
    }
    xhttp.open("GET", "components/" + page + ".html", true);
    xhttp.send();
    console.log("📄 components/" + page + ".html")
    if(with_script){
        load_js(page);
    }
}

function load_js(page) {
    fetch("components/" + page + ".js")
        .then(response => {
            if (!response.ok) {
                throw new Error('Le fichier profile.js n\'a pas été trouvé.');
            }

        })
        .then(data => {
         
            // Faites quelque chose avec les données du fichier
            var script_app = document.createElement('script');
            script_app.src = "components/" + page + ".js"
            document.head.appendChild(script_app);
            console.log("📜 components/" + page + ".js")
            return true;
        })
        .catch(error => {
            // Traitez l'erreur ici
            return false;
        });
}



