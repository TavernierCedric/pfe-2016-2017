// test
$('#bouton').click(function() {
  $("#accueil").css("visibility","visible");
  $("#recuperationFeuille").css("visibility","hidden");
});

$('#close_accueil').click(function() {
  $("#accueil").css("visibility","hidden");
  $("#recuperationFeuille").css("visibility","visible");
});