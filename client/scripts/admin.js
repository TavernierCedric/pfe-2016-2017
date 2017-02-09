$(document).ready(function() {
    getProfils();
    getLogiciels();
});

var address = "http://10.0.115.233:8080";
// Navigation

$('#navAccueil').click(function() {
    closeAccueil();    
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#utilisateurSelect').html(" ");
    $('#profilSelect').html(" ");
    $('#profilLogicielSelect').html(" ");
    $('#listeLogiciels').html(" ");
    $('#recuperationFeuille').css('visibility','visible');
    $('#gestionUtilisateur').css('visibility','hidden');
    $('#gestionLogiciel').css('visibility','hidden');
    $('#gestionProfil').css('visibility','hidden');
    $('#gestionImport').css('visibility','hidden');
    $('#gestionProfilLogiciel').css('visibility','hidden');
});

$('#navUtilisateurs').click(function() {
    closeAccueil();
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#utilisateurSelect').html(" ");
    $('#profilSelect').html(" ");
    $('#profilLogicielSelect').html(" ");
    $('#listeLogiciels').html(" ");
    $('#gestionUtilisateur').css('visibility','visible');
    $('#recuperationFeuille').css('visibility','hidden');
    $('#gestionLogiciel').css('visibility','hidden');
    $('#gestionProfil').css('visibility','hidden');
    $('#gestionImport').css('visibility','hidden');
    $('#gestionProfilLogiciel').css('visibility','hidden');
    getProfils();
});

$('#navLogiciels').click(function() {
    closeAccueil();
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#utilisateurSelect').html(" ");
    $('#profilSelect').html(" ");
    $('#profilLogicielSelect').html(" ");
    $('#listeLogiciels').html(" ");
    $('#gestionLogiciel').css('visibility','visible');
    $('#gestionUtilisateur').css('visibility','hidden');
    $('#recuperationFeuille').css('visibility','hidden');
    $('#gestionProfil').css('visibility','hidden');
    $('#gestionImport').css('visibility','hidden');
    $('#gestionProfilLogiciel').css('visibility','hidden');
    getLogiciels();
});

$('#navProfils').click(function() {
    closeAccueil();
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#utilisateurSelect').html(" ");
    $('#profilSelect').html(" ");
    $('#profilLogicielSelect').html(" ");
    $('#listeLogiciels').html(" ");
    $('#gestionProfil').css('visibility','visible');
    $('#gestionLogiciel').css('visibility','hidden');
    $('#gestionUtilisateur').css('visibility','hidden');
    $('#recuperationFeuille').css('visibility','hidden');
    $('#gestionImport').css('visibility','hidden');
    $('#gestionProfilLogiciel').css('visibility','hidden');
    getProfils();
});

$('#navImport').click(function() {
    closeAccueil();
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#utilisateurSelect').html(" ");
    $('#profilSelect').html(" ");
    $('#profilLogicielSelect').html(" ");
    $('#listeLogiciels').html(" ");
    $('#gestionImport').css('visibility','visible');
    $('#gestionProfil').css('visibility','hidden');
    $('#gestionLogiciel').css('visibility','hidden');
    $('#gestionUtilisateur').css('visibility','hidden');
    $('#recuperationFeuille').css('visibility','hidden');
    $('#gestionProfilLogiciel').css('visibility','hidden');
});

$('#navProLog').click(function() {
    closeAccueil();
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#utilisateurSelect').html(" ");
    $('#profilSelect').html(" ");
    $('#profilLogicielSelect').html(" ");
    $('#listeLogiciels').html(" ");
    $('#gestionProfilLogiciel').css('visibility','visible');
    $('#gestionProfil').css('visibility','hidden');
    $('#gestionLogiciel').css('visibility','hidden');
    $('#gestionUtilisateur').css('visibility','hidden');
    $('#recuperationFeuille').css('visibility','hidden');
    $('#gestionImport').css('visibility','hidden');
    getProfils();
    getLogiciels();
});


// Gestion matricule
// Récuperation des données apd matricule
$('#bouton').click(function() {
    var maData = { matricule : $('#matricule').val() };
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
                $('#test').html("Matricule inconnu");
                $('#bouton').css("margin-top","4.5vw");          
            }
            else{
                $('#test').html(" ");
                $('#bouton').css("margin-top","6vw");                
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
            alert(JSON.stringify(jqXHR) + " " + errorThrown + " " + textStatus);
        }
    });
});

// Gestion utilisateurs
$('#boutonUtilisateur').click(function() {
    var json = formToJson($('#formUtilisateur'));
    var type = json.type;

    if(type == 'Invite'){
        $.ajax({
            url: address+"/utilisateursinvitee",
            type: "POST",
            dataType: "JSON",
            crossDomain: true,
            beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
            contentType: "application/json",
            cache: false,
            timeout: 5000,
            data: JSON.stringify(json),
            success: function(data) {
                alert('Inscription reussie');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + " " + errorThrown + " " + textStatus);
                $('.erreur').remove();
                $('#boutonUtilisateur').before('<div class="erreur" >Erreur : Inscription ratee !</div>');
            }
        });
    }
    
    else{
        $.ajax({
            url: address+"/utilisateursprof",
            type: "POST",
            dataType: "JSON",
            crossDomain: true,
            beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
            contentType: "application/json",
            cache: false,
            timeout: 5000,
            data: JSON.stringify(json),
            success: function(data) {
                alert('Inscription reussie');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + " " + errorThrown + " " + textStatus);
                $('.erreur').remove();
                $('#boutonUtilisateur').before('<div class="erreur" >Erreur : Inscription ratee !</div>');
            }
        });
    }
    
});

// Fermeture données matricule
$('#close_accueil').click(function() {
    closeAccueil();
});



/*
    Gestion logiciels
*/
// Enregistrer Logiciel
$('#boutonLogicielEnregistrer').click(function() {
    
    var json = formToJson($('#formLogicielB'));

    $.ajax({
        url: address+"/logicielsajout",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
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
        url: address+"/logicielsput",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
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
        url: address+"/logicielsdelete",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
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

$('#boutonProfilLogicielEnvoyer').click(function(event) {
    event.preventDefault();
    var json = formToJson($('#formProfilLogiciel'));
    $.ajax({
        url: address+"/profilslogiciel",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data:JSON.stringify(json),
        success: function(data) {
            for(var i = 0; i < data.length; i++){
                $("#listeLogiciels :input").each(function(){

                    if($(this).val() == data[i].nom)
                        $(this).prop('checked', true);
                });
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Erreur chargement getLogiciels !');
        }
    });
});

$('#boutonProfilLogicielChanger').click(function(event) {
    event.preventDefault();
    var nomProfil;
    $('#formProfilLogiciel').find('select').each(function(i, el) {
        var selected = $(el).find('option:selected');
        nomProfil = $(el).val();
    });
    var json = formToJson($('#listeLogiciels'));
    var table = {profil : nomProfil, logiciels : JSON.stringify(json)};

    $.ajax({
        url: address+"/profilslogicielupdate",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data:JSON.stringify(table),
        success: function(data) {
            alert("ok");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Erreur chargement getLogiciels !');
        }
    });
});


function getLogiciels() {
    $.ajax({
        url: address+"/logiciels",
        type: "GET",
        dataType: "JSON",
        crossDomain: true,
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data:null,
        success: function(data) {
            // Doit me renvoyer les noms des logiciels
            for(var i = 0; i < data.length; i++){
                $('#logicielSelect').append("<option value='"+data[i].nom+"' name='name'>"+data[i].nom+"</option>");
                $('#listeLogiciels').append("<input name='name' type='checkbox' value='"+data[i].nom+"'>"+data[i].nom+"<br>");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Erreur chargement getLogiciels !');
        }
    });
}

/** 
    Gestion profils
*/
// Enregistrer Profil
$('#boutonProfilEnregistrer').click(function() {
    
    var json = formToJson($('#formProfilB'));

    $.ajax({
        url: address+"/profilsajout",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        cache: false,
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
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
    var json = formToJson($('#formProfilA'));

    $.ajax({
        url: address+"/profilsput",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        contentType: "application/json",
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},        
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
            alert('Modification reussie Logiciel');
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
        url: address+"/profilsdelete",
        type: "POST",
        dataType: "JSON",
        crossDomain: true,
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data: JSON.stringify(json),
        success: function(data) {
            alert('Suppression reussie Logiciel');
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
        url: address+"/profils",
        type: "GET",
        dataType: "JSON",
        crossDomain: true,
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data:null,
        success: function(data) {
            // Doit me renvoyer les noms des logiciels
            for(var i = 0; i < data.length; i++){
                $('#utilisateurSelect').append("<option value='"+data[i].nom+"' name='name'>"+data[i].nom+"</option>");
                $('#profilSelect').append("<option value='"+data[i].nom+"' name='name'>"+data[i].nom+"</option>");
                $('#profilLogicielSelect').append("<option value='"+data[i].nom+"' name='name'>"+data[i].nom+"</option>");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Erreur chargement getProfils !');
        }
    });
}

/**
    Gestion Import
*/

// Importer les étudiants 
$('#formImport').submit(function(e) {
    if ( $('#infoImport').val().match(/.+\.(csv)$/i) ) {
        return; // Autorise la soumission
    }else{
        e.preventDefault(); // Empeche la soumission
    }
});



function formToJson(formulaire) {
    var cible = {};
    $(formulaire).find('input[type=text]').each(function(i, el) {
                cible[$(el).attr('name')] = $(el).val();
    });

    $(formulaire).find('input[type=radio]:checked').each(function(i, el) {
        cible[$(el).attr('name')] = $(el).val();
    });

    $(formulaire).find('input[type=checkbox]:checked').each(function(i, el) {
        cible[$(el).attr('value')] = $(el).val();
    });

    $(formulaire).find('select').each(function(i, el) {
        var selected = $(el).find('option:selected');
        cible[$(selected).attr('name')] = $(el).val();
    });
    return cible;
}

//Enleve toutes les erreurs
function nettoyerErreur() {
     $('.erreur').remove();
}

$('#boutonDec').click(function() {
    localStorage.getItem("token");
    document.location.href="index.html"
});

function closeAccueil(){
    $("#accueil").css("visibility","hidden");
    $("#recuperationFeuille").css("visibility","visible");
    $('#matriculeID').html(" ");
    $('#matriculeNom').html(" ");
    $('#matriculePrenom').html(" ");
    $('#matriculeMail').html(" ");
    $('#matriculeProfil').html(" ");
    $('#matriculeLogin').html(" ");
    $('#matriculeLogiciels').html(" ");
}