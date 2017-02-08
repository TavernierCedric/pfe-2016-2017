var bcrypt   = require('bcrypt-nodejs');
var express = require('express'),
    router = express.Router(),
    models = require('../models/index'),
    jwt    = require('jsonwebtoken'),
    server    = require('../server')

router.post('/connexion', function(req, res) {

  models.sequelize.query('SELECT utilisateurs_logiciels.mdp, utilisateurs.login FROM utilisateurs AS utilisateurs, utilisateurs_logiciels AS utilisateurs_logiciels WHERE utilisateurs_logiciels.id_utilisateur = utilisateurs.id_utilisateur ' 
+'AND utilisateurs.login = ?',
  { replacements: [req.body.login], type: models.sequelize.QueryTypes.SELECT }
).then(function(user,err) {
    if(err){
      throw err;
    }
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    }else if (!bcrypt.compareSync(req.body.mdp, bcrypt.hashSync(user[0].mdp, bcrypt.genSaltSync(8), null)) ){
      res.json({ success: false, message: 'Authentication failed. Password is not correct.' });
    }else{
        var token = jwt.sign({ data: user }, 'ilovepfe',{ expiresIn: 60 * 60 });
        res.json({
          success: true,
          message: 'Token',
          token: token
        });
      }   
  });
});

router.post('/deconnexion', function (req, res) {
       console.log("post");
       var table = req.body;
       console.log(table);       
       res.json("reussis");
  });

router.post('/matricule', function (req, res) {
       console.log("post");
       var matricule = req.body.matricule;
       /* recupere le sql en fct du matrile et le renvoyer en json 
       */
      
       console.log(matricule);
       res.json(matricule)
  });

router.use(function(req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'ilovepfe', function(err, decoded) {      
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

  /* csv inser en fct du csv */
router.post('/csv', function (req, res) {
       console.log("post");
       var  data = req.body;
       console.log(data);
       var table = req.body.data;
       console.log(table);
  });

router.post('/profil', function(req, res) {

  models.profils.findOne({where: {nom: req.body.profil}}).then(function (profils) {
    console.log(models.sequelize.get('nom'));
    res.json({ success: true, message: 'profile found '})
  });
});


module.exports = router;