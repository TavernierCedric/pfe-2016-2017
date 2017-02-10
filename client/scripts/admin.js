////////////////////////////////////////////////
// Que faire une fois que document est chargé //
////////////////////////////////////////////////
$(document).ready(function() {
    getProfils();
    getLogiciels();
});


/////////////////////////////////////////////
// Variable pour garder address du serveur //
/////////////////////////////////////////////
var address = "http://localhost:8080";


/////////////////////////////
// Navigation Selon Clicks //
/////////////////////////////
$('#navAccueil').click(function() {
    closeAccueil();    
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#logicielSelectB').html(" ");
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
    $('#gestionScripts').css('visibility','hidden');
});

$('#navUtilisateurs').click(function() {
    closeAccueil();
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#logicielSelectB').html(" ");
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
    $('#gestionScripts').css('visibility','hidden');
    getProfils();
});

$('#navLogiciels').click(function() {
    closeAccueil();
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#logicielSelectB').html(" ");
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
    $('#gestionScripts').css('visibility','hidden');
    getLogiciels();
});

$('#navProfils').click(function() {
    closeAccueil();
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#logicielSelectB').html(" ");
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
    $('#gestionScripts').css('visibility','hidden');
    getProfils();
});

$('#navImport').click(function() {
    closeAccueil();
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#logicielSelectB').html(" ");
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
    $('#gestionScripts').css('visibility','hidden');
});

$('#navProLog').click(function() {
    closeAccueil();
    nettoyerErreur();
    $('#logicielSelect').html(" ");
    $('#logicielSelectB').html(" ");
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
    $('#gestionScripts').css('visibility','hidden');
    getProfils();
    getLogiciels();
});

$('#navScripts').click(function() {
    closeAccueil();
    nettoyerErreur();
    $('#logicielSelectB').html(" ");
    $('#logicielSelect').html(" ");
    $('#utilisateurSelect').html(" ");
    $('#profilSelect').html(" ");
    $('#profilLogicielSelect').html(" ");
    $('#listeLogiciels').html(" ");
    $('#gestionScripts').css('visibility','visible');
    $('#gestionProfilLogiciel').css('visibility','hidden');
    $('#gestionProfil').css('visibility','hidden');
    $('#gestionLogiciel').css('visibility','hidden');
    $('#gestionUtilisateur').css('visibility','hidden');
    $('#recuperationFeuille').css('visibility','hidden');
    $('#gestionImport').css('visibility','hidden');
    getLogiciels();
});
// Fin Navigation Selon Click

//////////////////////////////
// Appels Utilisant Serveur //
//////////////////////////////

// 1. Récuperation des données apd matricule
////////////////////////////////////////////
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

// 2. Ajout d'un utilisateur
////////////////////////////
$('#boutonUtilisateur').click(function(event) {
    //empeche la redirection
    event.preventDefault();

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
                $('#erreurUtilisateur').html("Erreur");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#erreurUtilisateur').html("Erreur");
            }
        });
    }
    
});

// 3. Ajout d'un profil
///////////////////////
$('#boutonProfilEnregistrer').click(function(event) {
    //empeche la redirection
    event.preventDefault();
    
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

// 4. Modification d'un profil
//////////////////////////////
$('#boutonProfilModifier').click(function(event) {
    //empeche la redirection
    event.preventDefault();

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

// 5. Suppression d'un profil
/////////////////////////////
$('#boutonProfilSupprimer').click(function(event) {
    //empeche la redirection
    event.preventDefault();

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

// 6. Recuperation des profils
//////////////////////////////
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

// 7. Ajout d'un logiciel
/////////////////////////
$('#boutonLogicielEnregistrer').click(function(event) {
    //empeche la redirection
    event.preventDefault();
    var json = formToJson($('#formLogicielB'));
    if(json.nom != " " && json.nom != null){
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
            }
        });
    }
    else{
        alert("Nom logiciel non valide");
    }
});

// 8. Modification d'un logiciel
////////////////////////////////
$('#boutonLogicielModifier').click(function() {

    var json = formToJson($('#formLogicielA'));

    if(json.nom != " " && json.nom != null){
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
    }
    else{
        alert("Nom logiciel non valide");
    }
});

// 9. Suppression d'un logiciel
///////////////////////////////
$('#boutonLogicielSupprimer').click(function(event) {
    //empeche la redirection
    event.preventDefault();

    var json = formToJson($('#formLogicielA'));

    if(json.nom != " " && json.nom != null){
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
    }
    else{
        alert("Nom logiciel non valide");
    }
});

// 10. Recuperation des logiciels
/////////////////////////////////
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
                $('#listeLogiciels').append("<input name='name' type='checkbox' value='"+data[i].nom+"'> "+data[i].nom+"<br>");
                $('#logicielSelectB').append("<option value='"+data[i].nom+"' name='name'>"+data[i].nom+"</option>");
            }
            $('#listeLogiciels').append("<br>");
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}

// 11. Recuperation des logiciels d'un profil
/////////////////////////////////////////////
$('#boutonProfilLogicielEnvoyer').click(function(event) {
    //empeche la redirection
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
            emptyCheckbox();
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

// 12. Modification des logiciels d'un profil
/////////////////////////////////////////////
$('#boutonProfilLogicielChanger').click(function(event) {
    //empeche la redirection
    event.preventDefault();    

    var nomProfil;
    $('#formProfilLogiciel').find('select').each(function(i, el) {
        var selected = $(el).find('option:selected');
        nomProfil = $(el).val();
    });
    var json = formToJson($('#listeLogiciels'));
    var table = {profil : nomProfil, logiciels : json};

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

// 13. Création du fichier en fonction de l'export demandé 
//////////////////////////////////////////////////////////
$('#boutonEnvoyerScript').click(function(event){
    //empeche la redirection
    event.preventDefault();    

    var selected;
    $('#formScripts').find('select').each(function(i, el) {
        selected = $(el).find('option:selected').val();
    });
    if(selected == "Claroline"){
        $.ajax({
            url: address+"/claroline",
            type: "GET",
            dataType: "JSON",
            crossDomain: true,
            beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
            contentType: "application/json",
            cache: false,
            timeout: 5000,
            data:null,
            success: function(data) {
                var csv = ConvertToCSVClaroline(data);
                var a         = document.createElement('a');
                a.href        = 'data:attachment/csv,' +  encodeURIComponent(csv);
                a.target      = '_blank';
                a.download    = 'claroline.csv';
                a.click();

                $('#gestionScripts').append(a);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //
            }
        });
    }
    else if(selected == "Windows"){
        $.ajax({
            url: address+"/windows",
            type: "GET",
            dataType: "JSON",
            crossDomain: true,
            beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
            contentType: "application/json",
            cache: false,
            timeout: 5000,
            data:null,
            success: function(data) {
                var bat = ConvertToBATWindows(data);
                var a         = document.createElement('a');
                a.href        = 'data:attachment/bat,' +  encodeURIComponent(bat);
                a.target      = '_blank';
                a.download    = 'windows.bat';
                a.click();

                $('#gestionScripts').append(a);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //
            }
        });
    }
    else if(selected == "Nutrilog"){
        $.ajax({
            url: address+"/nutrilog",
            type: "GET",
            dataType: "JSON",
            crossDomain: true,
            beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
            contentType: "application/json",
            cache: false,
            timeout: 5000,
            data:null,
            success: function(data) {
                var csv = ConvertToCSVNutrilog(data);
                var a         = document.createElement('a');
                a.href        = 'data:attachment/csv,' +  encodeURIComponent(csv);
                a.target      = '_blank';
                a.download    = 'nutrilog.csv';
                a.click();

                $('#gestionScripts').append(a);            },
            error: function(jqXHR, textStatus, errorThrown) {
                //
            }
        });
    }
});
// Fin Appels Utilisant Serveur

// Transforme chaque donnee utilisée dans un form en un JSON
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

// Deconnexion, supprime token dans localStorage
$('#boutonDec').click(function(event) {
    //empeche la redirection
    event.preventDefault();

    localStorage.setItem("token",null);
    document.location.href="index.html"
});

// Enleve toutes les erreurs
function nettoyerErreur() {
     $('.erreur').remove();
}

// Appel de Fermeture données matricule
$('#close_accueil').click(function() {
    closeAccueil();
});

// Fermeture données matricule
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

// Fonction pour vider checkbox listLogiciels
function emptyCheckbox(){
    $("#listeLogiciels :input").each(function(){
        $(this).prop('checked', false);
    });       
}

// Verifie si paramètre recu est un int
function isInt(x) {
   var y = parseInt(x, 10);
   return !isNaN(y) && x == y && x.toString() == y.toString();
}

// Converti JSON vers CSV format Claroline
function ConvertToCSVClaroline(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ';'
                line += array[i][index];
            }
            str += line + '\r\n';
    }
    return str;
}

// Converti JSON vers CSV format Nutrilog
function ConvertToCSVNutrilog(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
                line += array[i][index];
            }
            str += line + '\r\n';
    }
    return str;
}

// Converti JSON vers BAT format Windows
function ConvertToBATWindows(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        var count = 0;
        for (var index in array[i]) {
                if(count == 0)
                    line += "dsdadd "+array[i][index];
                if(count == 1)
                    line += "/prenom="+array[i][index];
                if(count == 2)
                    line += "/mdp="+array[i][index];
                count++;
            }
            str += line + '\r\n';
    }
    return str;
}