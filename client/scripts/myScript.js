// Variable pour garder address du serveur
var address = "http://localhost:8080";

// Récuperation des données apd matricule
$('#boutonMatricule').click(function(event) {
  event.preventDefault();
  var maData = { matricule : $('#matricule').val() };
  if (isInt($('#matricule').val())){
    $.ajax({
        url: address+"/matricule",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(maData),
        success: function(data) {
          if(data.informationetudiant == "null"){
            $('#erreurMatricule').html("Matricule inconnu");
            $('#boutonMatricule').css("margin-top","4.5vw");
          }
          else{
            $('#erreurMatricule').html(" ");
            $('#boutonMatricule').css("margin-top","6vw");
            $('#accueil').css("visibility", "visible");
            $('#recuperationFeuille').css("visibility", "hidden");
            var table = data.informationetudiant.split(',');
            $('#matriculeID').html("ID = "+table[0]);
            $('#matriculeNom').html("Nom = "+table[1]);
            $('#matriculePrenom').html("Prenom = "+table[2]);
            $('#matriculeMail').html("Mail = "+table[3]);
            $('#matriculeProfil').html("Profil = "+table[4]);
            $('#matriculeLogin').html("Login = "+table[5]);
            $('#matriculeLogiciels').css("list-style-type","none");
            for(var i = 6; i < table.length; i = i + 2){
                $('#matriculeLogiciels').append("<li> Logiciel = "+table[i]+"</li>");
                $('#matriculeLogiciels').append("<li> Mdp = "+table[i+1]+"</li>");
            }
        }
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
  }
  else{
    $('#erreurMatricule').html("Matricule inconnu");
    $('#boutonMatricule').css("margin-top","4.5vw");
  }
});

// Connexion d'un admin
$('#connexionbouton').click(function(event) {
  $('#error').html("");
  event.preventDefault();
  var maData = { login : $('#login').val(), mdp : $('#mdp').val()};
  $.ajax({
        url: address+"/connexion",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(maData),
        success: function(data) {
          if(data.success){
            localStorage.setItem('token', data.token);
            document.location.href="admin.html";
          }
          else{
            $('#erreurConnexion').html("Donnees recues inconnues");
            $('#connexionbouton').css("margin-top","1vw");
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#erreurConnexion').html("Donnees recues inconnues");
            $('#connexionbouton').css("margin-top","1vw");        
          }
    });
});

// Fermeture données matricule
$('#close_accueil').click(function() {
    $("#accueil").css("visibility","hidden");
    $("#recuperationFeuille").css("visibility","visible");
    $('#matriculeID').html(" ");
    $('#matriculeNom').html(" ");
    $('#matriculePrenom').html(" ");
    $('#matriculeMail').html(" ");
    $('#matriculeProfil').html(" ");
    $('#matriculeLogin').html(" ");
    $('#matriculeLogiciels').html(" ");
});

// Ouvrir la fenêtre de connexion
$('#boutonConnexion').click(function() {
  $("#hide").css("visibility","visible");
});

// Fermer la fenêtre de connexion
$('#closeConnexionButton').click(function() {
  $("#hide").css("visibility","hidden");
  $('#connexionbouton').css("margin-top","2.5vw");        
});

// Verifie si paramètre recu est un int
function isInt(x) {
   var y = parseInt(x, 10);
   return !isNaN(y) && x == y && x.toString() == y.toString();
}
