// Navigation
$('#navAccueil').click(function() {
	nettoyerErreur();
	$('#recuperationFeuille').css('visibility','visible');
	$('#gestionUtilisateur').css('visibility','hidden');
	$('#gestionLogiciel').css('visibility','hidden');

});

$('#navUtilisateurs').click(function() {
	nettoyerErreur();
	$('#gestionUtilisateur').css('visibility','visible');
	$('#recuperationFeuille').css('visibility','hidden');
	$('#gestionLogiciel').css('visibility','hidden');

});

$('#navLogiciels').click(function() {
	nettoyerErreur();
	$('#gestionLogiciel').css('visibility','visible');
	$('#gestionUtilisateur').css('visibility','hidden');
	$('#recuperationFeuille').css('visibility','hidden');
	getLogiciels();
});

// DEJA PRESENTE DANS MYSCRIPT A VERIFIER !
// Gestion matricule
$('#bouton').click(function() {
	var json = formToJson($('#formUtilisateur'));

	$.ajax({
        url: "http://10.0.128.144:8080/accueil",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
        	 $('#matricule').val(JSON.stringify(data));
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + " " + errorThrown + " " + textStatus);
            $('.erreur').remove();
            $('#bouton').before('<div class="erreur" >Erreur : Matricule inexistant !</div>');
        }
    });
});

// Gestion utilisateurs
$('#boutonUtilisateur').click(function() {
	var json = formToJson($('#formUtilisateur'));

	$.ajax({
        url: "http://10.0.128.144:8080/utilisateurs",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
        	alert('Inscription reussie');
          //$('#bouton').before('<div class="reussite">Inscription reussie</div>');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + " " + errorThrown + " " + textStatus);
            $('.erreur').remove();
            $('#boutonUtilisateur').before('<div class="erreur" >Erreur : Inscription ratee !</div>');
        }
    });
})


/** 
	Gestion logiciels
*/
// Enregistrer Logiciel
$('#boutonLogicielEnregistrer').click(function() {
	
	var json = formToJson($('#formLogicielB'));

	$.ajax({
        url: "http://10.0.128.144:8080/logiciels",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
        	 alert('Enregistrement réussie Logiciel');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + " " + errorThrown + " " + textStatus);
            $('.erreur').remove();
            $('#boutonLogiciel').before('<div class="erreur" >Erreur : Logiciel inexistant !</div>');
        }
    });
});

// Modifier Logiciel
$('#boutonLogicielModifier').click(function() {
	var json = formToJson($('#formLogicielA'));

	$.ajax({
        url: "http://10.0.128.144:8080/logiciels",
        type: "PUT",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
        	alert('Modification reussie');
          //$('#bouton').before('<div class="reussite">Inscription reussie</div>');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + " " + errorThrown + " " + textStatus);
            $('.erreur').remove();
            $('#boutonLogicielModifier').before('<div class="erreur" >Erreur : Modification ratee !</div>');
        }
    });
});

// Supprimer Logiciel
$('#boutonLogicielSupprimer').click(function() {
	var json = formToJson($('#formLogicielA'));

	$.ajax({
        url: "http://10.0.128.144:8080/logiciels",
        type: "DELETE",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
        	alert('Suppression reussie');
          //$('#bouton').before('<div class="reussite">Inscription reussie</div>');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + " " + errorThrown + " " + textStatus);
            $('.erreur').remove();
            $('#boutonLogicielSupprimer').before('<div class="erreur" >Erreur : Suppression ratee !</div>');
        }
    });
});

function getLogiciels() {
	$.ajax({
        url: "http://10.0.128.144:8080/logiciels",
        type: "GET",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
        	// Doit me renvoyer les noms des logiciels
        	var reponse = JSON.stringify(data);
        	chargerSelectLogiciel(reponse);
        },
        error: function(jqXHR, textStatus, errorThrown) {
        	alert('Erreur chargement getLogiciels !');
        }
    });
}

function chargerSelectLogiciel(options) {
	$('#logicielSelect').empty();
	for (var i = 0; i < options.length; i++) {
		var opt = $('<option>');
		$(opt).val(options[i]).text(options[i]);
		$('#logicielSelect').append(opt);
	}
	var nom = $('#nomLogiciel').find(':selected').val();
	$('#nomLogiciel').val(nom);
}

/** 
	Gestion profils
*/
// Enregistrer Profil
$('#boutonProfilEnregistrer').click(function() {
	
	var json = formToJson($('#formProfilB'));

	$.ajax({
        url: "http://10.0.128.144:8080/profils",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
        	 alert('Enregistrement réussie Logiciel');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + " " + errorThrown + " " + textStatus);
            $('.erreur').remove();
            $('#boutonLogiciel').before('<div class="erreur" >Erreur : Logiciel inexistant !</div>');
        }
    });
});

// Modifier Profil
$('#boutonProfilModifier').click(function() {
	var json = formToJson($('#formLogicielA'));

	$.ajax({
        url: "http://10.0.128.144:8080/profils",
        type: "PUT",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
        	alert('Modification reussie Logiciel');
          //$('#bouton').before('<div class="reussite">Inscription reussie</div>');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + " " + errorThrown + " " + textStatus);
            $('.erreur').remove();
            $('#boutonLogicielModifier').before('<div class="erreur" >Erreur : Modification ratee Logiciel!</div>');
        }
    });
});

// Supprimer Profil
$('#boutonProfilSupprimer').click(function() {
	var json = formToJson($('#formProfilA'));

	$.ajax({
        url: "http://10.0.128.144:8080/profils",
        type: "DELETE",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
        	alert('Suppression reussie Logiciel');
          //$('#bouton').before('<div class="reussite">Inscription reussie</div>');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + " " + errorThrown + " " + textStatus);
            $('.erreur').remove();
            $('#boutonLogicielSupprimer').before('<div class="erreur" >Erreur : Suppression ratee Logiciel !</div>');
        }
    });
});

function getProfils() {
	$.ajax({
        url: "http://10.0.128.144:8080/profils",
        type: "GET",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
        	// Doit me renvoyer les noms des logiciels
        	var reponse = JSON.stringify(data);
        	chargerSelectProfil(reponse);
        },
        error: function(jqXHR, textStatus, errorThrown) {
        	alert('Erreur chargement getProfils !');
        }
    });
}

function chargerSelectProfil(options) {
	$('#profilSelect').empty();
	for (var i = 0; i < options.length; i++) {
		var opt = $('<option>');
		$(opt).val(options[i]).text(options[i]);
		$('#profilSelect').append(opt);
	}
	var nom = $('#nomProfil').find(':selected').val();
	$('#nomProfil').val(nom);
}



function formToJson(formulaire) {

	var cible = {};

	$(formulaire).find('input[type=text]').each(function(i, el) {
				cible[$(el).attr('name')] = $(el).val();
	});

	$(formulaire).find('input[type=radio]:checked').each(function(i, el) {
		cible[$(el).attr('name')] = $(el).val();
	});

	$(formulaire).find('input[type=checkbox]:checked').each(function(i, el) {
		cible[$(el).attr('name')] = $(el).val();
	});

	$(formulaire).find('select').each(function(i, el) {
		var selected = $(el).find('option:selected');
		cible[$(el).attr('name')] = $(el).val();
	});
	console.log(JSON.stringify(cible));
	return cible;
}

//Enleve toutes les erreurs
function nettoyerErreur() {
	 $('.erreur').remove();
}
