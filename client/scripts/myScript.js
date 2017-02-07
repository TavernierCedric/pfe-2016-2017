// Exporter CSV Logins / Mdp Claroline

// Exporter CSV Logins / Mdp Nutrilog 

// Exporter BAT Logins / Mdp Windows

// Envoyer CSV au serveur

// Créer utilisateur

// Créer logiciel



// Récuperation des données apd matricule
$('#bouton').click(function() {
  var maData = { matricule : "1034" };
  $.ajax({
        url: "http://10.0.128.144:8080/test",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(maData),
        success: function(data) {
          $('#matricule').val(JSON.stringify(data));
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + " " + errorThrown + " " + textStatus);
            $('.erreur').remove();
            $('#bouton').before('<div class="erreur" >'+errorThrown+'</div>');

        }
    });
});

// Fermeture données matricule
$('#close_accueil').click(function() {
		$("#accueil").css("visibility","hidden");
 	 	$("#recuperationFeuille").css("visibility","visible");
    $("#accueil").html(" ");
});

// Ouvrir la fenêtre de connexion
$('#boutonConnexion').click(function() {
  $("#hide").css("visibility","visible");
});

// Fermer la fenêtre de connexion
$('#closeConnexionButton').click(function() {
  $("#hide").css("visibility","hidden");
});

// Connexion d'un admin
$('#connexionbouton').click(function() {

	var maData = { login : $('#login').val(), mdp : $('#mdp').val() };
	$.ajax({
        url: "http://10.0.128.144:8080/connexion",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(maData),
        success: function(data) {
	        $("#firstBody").css("visibility","hidden");
	 			  $("#hide").css("visibility","hidden");
	  			$("#recuperationFeuille").css("visibility","hidden");
	  			$("#secondBody").css("visibility","visible");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + " " + errorThrown + " " + textStatus);
            $('.erreur').remove();
            $('#connexionbouton').before('<div class="erreur" >'+errorThrown+'</div>');

        }
    });
});

// Déconnexion
$('#boutonDec').click(function() {

  $.ajax({
      url: "http://10.0.128.144:8080/deconnexion",
      type: "POST",
      dataType: "JSON",
      crossDomain: true,
      contentType: "application/json",
      cache: false,
      timeout: 5000,
      data: JSON.stringify(maData),
      success: function(data) {
        $("#firstBody").css("visibility","hidden");
        $("#hide").css("visibility","hidden");
        $("#recuperationFeuille").css("visibility","hidden");
        $("#secondBody").css("visibility","visible");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR + " " + errorThrown + " " + textStatus);
        //$('.erreur').remove();
        //$('#connexionbouton').before('<div class="erreur" >'+errorThrown+'</div>');

      }
  });

  $("#firstBody").css("visibility","visible");
  $("#hide").css("visibility","hidden");
  $("#recuperationFeuille").css("visibility","visible");
  $("#secondBody").css("visibility","hidden");
});
