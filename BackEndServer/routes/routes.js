var express = require('express');
    router = express.Router();
    models = require('../models/index');

router.post('/connexion', function(req, res) {

  // find the user
  models.utilisateurs.findOne(req.body.login).then(function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    }else {
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        res.json({
          success: true,
          message: 'Token',
          token: token
        });
      }   
  });
});

  router.post('/matricule', function (req, res) {
       console.log("post");
       var matricule = req.body.matricule;
       /* recupere le sql en fct du matrile et le renvoyer en json 
       */
      
       console.log(matricule);
       res.json(matricule)
  });

router.post('/profil', function(req, res) {

  models.profils.findOne({where: {nom: req.body.profil}}).then(function (profils) {
    console.log(profils.get('nom'));
    res.json({ success: true, message: 'profile found '})
  });
});

router.post('/deconnexion', function (req, res) {
       console.log("post");
       var table = req.body;
       console.log(table);       
       res.json("reussis");
  });
  /* csv inser en fct du csv */
router.post('/csv', function (req, res) {
       console.log("post");
       var  data = req.body;
       console.log(data);
       var table = req.body.data;
       console.log(table);
  });

router.use(function(req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});


module.exports = router;