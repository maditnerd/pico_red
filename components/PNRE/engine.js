// PNRE (Pico Node Red Engine)
class PNRE {
  constructor() {
    this.app_id = "17070e64-d90f-4853-8c4a-bed87b358f71";
    this.token = localStorage.getItem(this.app_id + "token");
    this.server = localStorage.getItem(this.app_id + "server");
    this.user = {};
    this.temp_login = null;
    this.ws = null;
    this.connected = false;

    this.loading();
    if (this.serverExists()) {
      console.log("🖲️ Server 🆗");

      if (this.loginExists()) {
        console.log("🧔‍♂️ Token 🆗")
        this.connect();
      } else {
        console.log("🧔‍♂️ Token ❌")
        this.renderer("login");
      }
    } else {
      console.log("🖲️ Server ❌")
      this.renderer("server");
    }
    //this.loading();
    //this.checkConnect();
  }

  loading() {
    var bar = new ldBar(".ldBar", {
      "value": 100,
      "stroke-width": 0
    });
  }

  login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var server = document.getElementById("server").value;
    this.temp_login = {
      "type": "login",
      "email": email,
      "password": password
    };
    this.loginConnect();
    console.log(this.token);
  }

  showLoading() {
    document.getElementById("loading_screen").style.visibility = "visible";
    setTimeout(function() {
      document.getElementById("loading_screen").classList.add("visible");
    }, 500);
  }

  hideLoading() {
    document.getElementById("loading_screen").style.visibility = "hidden";
    document.getElementById("loading_screen").classList.remove("visible");
  }

  resetServer() {
    localStorage.removeItem(this.app_id + "server");
    this.resetLogin();
  }

  checkConnect(server) {
    console.log(server);
    var pattern = /^([a-zA-Z0-9]+\.)*[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (pattern.test(server)) {
      this.showLoading();
      const socket = new WebSocket("wss://" + server);
      socket.onopen = function () {
        this.hideLoading();
        console.log("Connexion OK");
        socket.close();
        localStorage.setItem(this.app_id + "server", server);
        location.reload();
      }.bind(this);
      socket.onerror = function () {
        this.hideLoading();
        swal("Connexion échouée", "Êtes-vous sûr de l'avoir bien tapée ?", "error");
        socket.close();
      }.bind(this);
    } else {
      console.log("Adresse invalide");
      swal("Adresse invalide", "", "error");
    }
  }

  loginExists() {
    if (localStorage.getItem(this.app_id + "token")) {
      return true;
    } else {
      return false;
    }
  }

  serverExists() {
    if (localStorage.getItem(this.app_id + "server")) {
      return true;
    } else {
      return false;
    }
  }

  websocketReceiver(event) {
    console.log(event.data);
  }

  loginConnect() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    this.checkLogin(email, password);
  }

  connect() {
    this.ws = new ReconnectingWebSocket("wss://" + this.server);
    this.ws.addEventListener('open', () => { });
    this.ws.onmessage = this.receive.bind(this);
    this.ws.onerror = function(){
      console.log("🖲️ Websocket ❌");
      this.connected = false;
    };
    this.ws.onopen = function(){
      if(!this.connected){
        console.log("🖲️ Websocket 🆗");
        pnre.checkToken();
        pnre.ask("roles");
        this.connected = true;
      }
    };
    this.ws.onclose = function(){
      console.log("Websocket has been closed");
    }
  }

  checkToken(){
    var checkTokenJSON = JSON.parse(this.token);
    checkTokenJSON.type = "token";
    this.ws.send(JSON.stringify(checkTokenJSON));
  }

  resetLogin() {
    localStorage.removeItem(this.app_id + "token");
    location.reload();
  }

  checkLogin(email, password) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (pattern.test(email)) {
      const socket = new WebSocket("wss://" + this.server);
      this.showLoading();
      socket.onopen = function () {
        console.log("Connexion OK");
        var loginObj = {
          "type": "login",
          "email": email,
          "password": password
        };
        socket.send(JSON.stringify(loginObj));
        console.log(loginObj);
      };
      socket.onmessage = function (event) {
        this.hideLoading();
        console.log(event.data);
        try {
          var jsonToken = JSON.parse(event.data);
        } catch (error) {
          swal("Login échoué", "Le serveur a renvoyé une réponse incorrecte", "error");
          socket.close();
          return;
        }
        switch (jsonToken.status) {
          case "success":
            var token = {
              token: jsonToken.token,
              email: email
            };
            localStorage.setItem(this.app_id + "token", JSON.stringify(token));
            socket.close();
            location.reload();
            break;
          case "not_found":
            swal("Utilisateur inconnu", "Email incorrect", "error");
            break;
          case "failed":
            swal("Mot de passe incorrect", "", "error");
            break;
          default:
            swal("Login échoué", "Erreur inconnue...", "", "error");
            break;
        }
      }.bind(this);
      socket.onerror = function () {
        this.hideLoading();
        swal("Connexion échouée", "Le serveur ne fonctionne pas 😭😭😭😿😿😿😭😭😭", "error");
        socket.close();
      }.bind(this);
    } else {
      console.log("Email invalide");
      swal("Email invalide!", "", "error");
    }
  }

  massRenderer() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              elmnt.innerHTML = this.responseText;
            }
            if (this.status == 404) {
              elmnt.innerHTML = "Page not found.";
            }
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
            change_theme_icon();
          }
        };
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
      }
    }
  }

  renderer(id) {
    var element = document.getElementById(id);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          element.innerHTML = this.responseText;
        }
      }
    };
    xhttp.open("GET", "components/PNRE/" + id + ".html", true);
    xhttp.send();
  }

  rendererTo(id, page, withScript = false) {
    var element = document.getElementById(id);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          element.innerHTML = this.responseText;
        }
      }
    };
    xhttp.open("GET", "components/PNRE/" + page + ".html", true);
    xhttp.send();
    console.log("📄 components/PNRE/" + page + ".html");
    if (withScript) {
      this.loadJs(page);
    }
  }

  loadJs(page) {
    fetch("components/PNRE/" + page + ".js")
      .then(response => {
        if (!response.ok) {
          throw new Error("Le fichier " + page + ".js n'a pas été trouvé.");
        }

      })
      .then(data => {
        var scriptApp = document.createElement('script');
        scriptApp.src = "components/PNRE/" + page + ".js";
        document.head.appendChild(scriptApp);
        console.log("📜 components/PNRE/" + page + ".js");
        return true;
      })
      .catch(error => {
        return false;
      });
  }

  receive(event) {
      try {
        var jsonToken = JSON.parse(event.data);
      } catch (error) {
        swal("Login échoué", "Le serveur a renvoyé une réponse incorrecte", "error");
        socket.close();
        return;
      }
      switch(jsonToken.type){
        case "check_token":
          switch(jsonToken.status){
            case "not_found":
            this.resetLogin();
            break;
            case "success":
            this.user.role = jsonToken.role;
            this.user.email = jsonToken.email;
            this.user.firstname = jsonToken.firstname;
            this.user.lastname = jsonToken.lastname;
            console.log("🧔‍♂️ User 🆗");
            console.log(this.user);
            document.getElementById("profile").setAttribute("data-letters","AA");
          }
          break;
        case "get_roles":
          var roles_data = JSON.parse(event.data);
          this.roles = JSON.parse(roles_data.roles);
        break;
      }
  }

  ask(type){
    var json_data = JSON.parse(this.token);
    json_data.type = type;
    this.ws.send(JSON.stringify(json_data));
  }
}

// Utilisation de la classe PNRE
var pnre = new PNRE();

