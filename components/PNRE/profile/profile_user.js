document.getElementById("item_profile").classList.add("selected");
document.getElementById("item_users").classList.remove("selected");
document.getElementById("item_password").classList.remove("selected");

document.getElementById("email").value = pnre.user.email
document.getElementById("firstname").value = pnre.user.firstname
document.getElementById("lastname").value = pnre.user.lastname
id = 0;
var roles_select = document.getElementById("roles");
pnre.roles.forEach(function(option){    
    console.log(option)
    var el = document.createElement("option");
    el.value = id
    el.text = option
    if(id == pnre.user.role){
        el.selected;
    }
    id++;
    roles_select.appendChild(el);
    if(pnre.user.role != 0){
        roles_select.disabled = true;
    }
});