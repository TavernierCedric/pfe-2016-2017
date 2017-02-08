var bcrypt = require('bcrypt-nodejs');
var express = require('express'),
  router = express.Router(),
  models = require('../models/index'),
  jwt = require('jsonwebtoken'),
  server = require('../server')
/*var randomstring = require("randomstring");
randomstring.generate({
length: 12,
charset: 'alphabetic'
}); */
router.post('/connexion', function (req, res) {

  models.sequelize.query('SELECT utilisateurs_logiciels.mdp, utilisateurs.login FROM utilisateurs AS utilisateurs, utilisateurs_logiciels AS utilisateurs_logiciels WHERE utilisateurs_logiciels.id_utilisateur = utilisateurs.id_utilisateur '
    + 'AND utilisateurs.login = ?',
    { replacements: [req.body.login], type: models.sequelize.QueryTypes.SELECT }
  ).then(function (user, err) {
    if (err) {
      throw err;
    }
    if (!user) {
      return res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (!bcrypt.compareSync(req.body.mdp, bcrypt.hashSync(user[0].mdp, bcrypt.genSaltSync(8), null))) {
      return res.json({ success: false, message: 'Authentication failed. Password is not correct.' });
    } else {
      var token = jwt.sign({ data: user }, 'ilovepfe', { expiresIn: 60 * 60 });
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
  models.sequelize.query('SELECT * FROM informationEtudiant(?)', { replacements: [req.body.matricule], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      console.log(data[0]);
      res.json(
        data[0])
    }
  });
});

router.use(function (req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'ilovepfe', function (err, decoded) {
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


router.post('/profilsajout', function (req, res) {
  models.profils.findOrCreate({
    where: {
      nom: req.body.nom
    }
  }).then(function (result) {
    var profil = result[0],
      created = result[1];

    if (!created) {
      console.log('Profil already exists');
      return res.send("profil already exists")
    } else {
      console.log('Created author...');
      res.send("profil created")
    }
  });

});

router.get('/profils/', function (req, res) {
  models.sequelize.query('SELECT * FROM profils', { type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      res.json(
        data)
    }
  });
});



router.post('/profilsput', function (req, res) {
  models.profils.find({
    where: {
      nom: req.body.name
    }
  }).then(function (profil) {
    if (profil) {
      profil.updateAttributes({
        nom: req.body.nom,
      }).then(function (profil) {
        res.send("profil updated");
      });
    }
  });
});
// Suppression de FK utilisée impossible
router.post('/profilsdelete', function (req, res) {
  models.profils.destroy({
    where: {
      nom: req.body.name
    }
  }).then(function (todo) {
    res.send("profil deleted");
  });
});

router.get('/logiciels', function (req, res) {
  models.sequelize.query('SELECT * FROM logiciels', { type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      res.json(
        data)
    }
  });
});

router.get('/utilisateurs', function (req, res) {
  models.sequelize.query('SELECT * FROM insererUtilisateur(?,?,?,?,?,?,?)', { replacements: [req.body.matricule, req.body.nom, req.body.prenom, req.body.mail, req.body.type, req.body.login, req.body.id_profil], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      res.json(
        data[0])
    }
  });
});

router.post('/utilisateursinvitee', function (req, res) {
  var nom = req.body.nom;
  var prenom = req.body.prenom;
  var type = req.body.type;
  var profil = req.body.name;
  var login = prenom.substring(0, 1) + nom.substring(0, 6);
  var idProfil;
  models.sequelize.query('SELECT id_profil from profils where nom like ?',
    { replacements: [profil], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
      if (err) {
        throw err
      } else {
        idProfil = data[0].id_profil;
        var query = 'INSERT INTO Utilisateurs (id_utilisateur, nom, prenom, type, login, id_profil) VALUES (DEFAULT,?,?,?,?,?)';
        models.sequelize.query(query, { replacements: [nom, prenom, type, login, idProfil], type: models.sequelize.QueryTypes.INSERT }).then(function (data, err) {
          if (err) {
            throw err;
          } else {
            res.json(
              data[0])
          }
        });
      }
    })

});

router.post('/utilisateursprof', function (req, res) {
  var nom = req.body.nom;
  var prenom = req.body.prenom;
  var type = req.body.type;
  var profil = req.body.name;
    console.log(type)
  if (type == "Prof") {
    var login = prenom.substring(0, 1) + nom.substring(0, 6);
    var idProfil;
    var mail = req.body.mail
    models.sequelize.query('SELECT id_profil from profils where nom like ?',
      { replacements: [profil], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
        if (err) {
          throw err
        } else {
          idProfil = data[0].id_profil;
          var query = 'INSERT INTO Utilisateurs (id_utilisateur, nom, prenom,mail, type, login, id_profil) VALUES (DEFAULT,?,?,?,?,?,?)';
          models.sequelize.query(query, { replacements: [nom, prenom, mail, type, login, idProfil], type: models.sequelize.QueryTypes.INSERT }).then(function (data, err) {
            if (err) {
              throw err;
            } else {
              res.json(
                data[0])
            }
          });
        }
      })
  }
  else{
    res.status(403).send({
      success: false,
      message: 'vous n\'est pas un prof'
    });

  }
});


router.post('/logicielsajout', function (req, res) {
  models.sequelize.query('SELECT * FROM ajoutLogiciel(?)', { replacements: [req.body.nom], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      res.json({ success: true, message: 'delete successful' });
    }
  });
});

router.post('/logicielsdelete', function (req, res) {
  models.sequelize.query('SELECT * FROM suppressionLogiciel(?)', { replacements: [req.body.name], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      res.send("data deleted")
    }
  });
});
router.post('/logicielsput', function (req, res) {
  models.sequelize.query('UPDATE logiciels SET nom=? WHERE nom LIKE ? ', { replacements: [req.body.nom, req.body.name], type: models.sequelize.QueryTypes.UPDATE }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      res.send("data modified")
    }
  });
});

/* csv inser en fct du csv */
router.post('/csv', function (req, res) {
  console.log("post");
  var data = req.body;
  console.log(data);
  var table = req.body.data;
  console.log(table);
});


router.post('/claroline', function (req, res) {
  models.sequelize.query('SELECT * FROM clarolineVersCSV(?, ?, ?, ?)', { replacements: [req.body.nom, req.body.prenom, req.body.mail, req.body.mdp], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      res.json(data[0]);
    }
  });
});

router.post('/windows', function (req, res) {
  models.sequelize.query('SELECT * FROM windowsVersBAT(?, ?, ?)', { replacements: [req.body.nom, req.body.prenom, body.mdp], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      res.json(data[0]);
    }
  });
});

router.post('/nutrilog', function (req, res) {
  models.sequelize.query('SELECT * FROM nutrilogVersCSV(?, ?, ?, ?)', { replacements: [req.body.id, req.body.nom, req.body.prenom, body.mdp], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      res.json(data[0]);
    }
  });
});
router.post('/profilslogiciel', function (req, res) {
  var profil = req.body.name;
  console.log(req.body)
  var query = 'select l.nom from gestionLogin.Profils p, gestionLogin.Profils_Logiciels pl, gestionLogin.Logiciels l where p.id_profil = pl.id_profil AND l.id_logiciel = pl.id_logiciel AND p.nom LIKE ?';
  models.sequelize.query(query, { replacements: [profil], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      console.log(data[0])
      res.json(data);
    }
  });
})
router.post('/profilslogicielupdate', function (req, res) {
  var profil = req.body.name;
  console.log(profil)
  var query = 'select l.nom from gestionLogin.Profils p, gestionLogin.Profils_Logiciels pl, gestionLogin.Logiciels l where p.id_profil = pl.id_profil AND l.id_logiciel = pl.id_logiciel AND p.nom LIKE ?';
  models.sequelize.query(query, { replacements: [profil], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      console.log(data[0])
      res.json(data);
    }
  });
})

module.exports = router;