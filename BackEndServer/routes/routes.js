var bcrypt = require('bcrypt-nodejs'),
  express = require('express'),
  router = express.Router(),
  models = require('../models/index'),
  jwt = require('jsonwebtoken'),
  server = require('../server'),
  csv = require('csv-stream'),
  fs = require('fs'),
  request = require('request'),
  utf8 = require('to-utf-8'),
  Promise = require('bluebird'),
  copyTo = require('pg-copy-streams').to,
  csv2 = require('csv');
  randomstring = require("randomstring");
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
  }).catch(function (err) {
    console.log("user not found")
    res.json({ success: false, message: 'Authentication failed. User not found.' });
});
});

router.post('/deconnexion', function (req, res) {
  var table = req.body;
  res.json("reussis");
});

router.post('/matricule', function (req, res) {
  models.sequelize.query('SELECT * FROM informationEtudiant(?)', { replacements: [req.body.matricule], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
    if (err) {
      throw err;
    } else {
      res.json(
        data[0])
    }
  });
});

/* csv inser en fct du csv */
router.post('/csv', function (req, res) {
  var csvStream = csv.createStream();
  fs.createReadStream(req.body.file ||'importEtudiants2017-01-29.csv').pipe(utf8()).pipe(csvStream)
    .on('error', function (err) {
      console.error(err);
    })
    .on('end', function () {
      // res.send("csv import complete")
    })
    .on('data', function (data) {
      var matriculeData = data['"Matric Info"'].replace(/['"]+/g, '');
      var nomData = data['"Nom Etudiant"'].replace(/['"]+/g, '')
      nomData = nomData.replace(/\s+/g, '');
      var prenomData = data['"Prénom Etudiant"'].replace(/['"]+/g, '');
      var anneeData = data['"Année"'].replace(/['"]+/g, '');
      var optionData = data['"Orientation"'].replace(/['"]+/g, '');
      var mailData = data['"EMail Etudiant 2"'].replace(/['"]+/g, '');
      var profilData = anneeData.substring(0, 1) + optionData.substring(0, 3);
      var loginData = prenomData.substring(0, 1) + nomData.substring(0, 6)
      loginData = loginData.toLowerCase();
      loginData = loginData.replace(new RegExp("[òóôõö]", 'g'), "o");
      loginData = loginData.replace(new RegExp("\\s", 'g'), "");
      loginData = loginData.replace(new RegExp("[àáâãäå]", 'g'), "a");
      loginData = loginData.replace(new RegExp("æ", 'g'), "ae");
      loginData = loginData.replace(new RegExp("ç", 'g'), "c");
      loginData = loginData.replace(new RegExp("[èéêë]", 'g'), "e");
      loginData = loginData.replace(new RegExp("[ìíîï]", 'g'), "i");
      loginData = loginData.replace(new RegExp("ñ", 'g'), "n");
      loginData = loginData.replace(new RegExp("[òóôõö]", 'g'), "o");
      loginData = loginData.replace(new RegExp("œ", 'g'), "oe");
      loginData = loginData.replace(new RegExp("[ùúûü]", 'g'), "u");
      loginData = loginData.replace(new RegExp("[ýÿ]", 'g'), "y");
      loginData = loginData.replace(new RegExp("\\W", 'g'), "");
      var query1 = 'INSERT INTO profils (nom) SELECT ? WHERE NOT EXISTS (SELECT id_profil FROM utilisateurs WHERE nom LIKE ?) RETURNING id_profil';
      var query2 = 'SELECT id_profil from profils WHERE nom LIKE ?'
      var query3 = 'INSERT INTO utilisateurs (matricule,nom,prenom,login,mail,id_profil,type) SELECT ?,?,?,?,?,?,? WHERE NOT EXISTS (SELECT id_utilisateur FROM utilisateurs WHERE matricule = ?) RETURNING id_utilisateur'
      var query4 = 'SELECT * FROM insererMotDePasse(?,?,?)'
      var profil;
      var user;
      var created;
      var randomsPasword = randomstring.generate({
            length: 8,
            charset: 'alphanumeric'
          });
      Promise.all([
        models.profils.findOrCreate({
          where: {
            nom: profilData
          }
        }).then(function (result) {
          profil = result[0].id_profil,
            created = result[1];
          if (!created) {
            console.log('Profil already exists');
          } else {
            console.log('Created profil...');
          }
        })
      ]).then(function () {
        Promise.all([
          models.utilisateurs.findOrCreate({
            where: {
              matricule: matriculeData,
              nom: nomData,
              prenom: prenomData,
              login: loginData,
              mail: mailData,
              id_profil: profil,
              type: 'Etudiant'
            }
          }).then(function (result) {
            user = result[0].id_utilisateur,
              created = result[1];
            if (!created) {
              console.log('user already exists');
            } else {
              console.log('Created user...');
            }
          })
        ]).then(function () {
          models.sequelize.query(query4, { replacements: [user, profil, randomsPasword], type: models.sequelize.QueryTypes.INSERT });
        })
      });
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
        console.log('profil author...');
        res.send("profil created")
      }
    });

  });

  router.get('/profils/', function (req, res) {
    models.sequelize.query('SELECT * FROM profils where nom NOT LIKE ?', {  replacements: ['Admin'], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
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
    models.sequelize.query('SELECT * FROM logiciels l WHERE l.nom NOT LIKE \'GLOBAL\'', { type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
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
    if (type == "Invite") {
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
    }
    else {
      res.status(403).send({
        success: false,
        message: 'vous n\'est pas une personne invité'
      });
    }
  });

  router.post('/utilisateursprof', function (req, res) {
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var type = req.body.type;
    var profil = req.body.name;
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
    else {
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


  router.get('/windows', function (req, res) {
    models.sequelize.query('SELECT * FROM windowsVersBAT', {type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
      if (err) {
        throw err;
      } else {
        res.json(data);
      }
    });
  });

  router.get('/nutrilog', function (req, res) {
    models.sequelize.query('SELECT * FROM nutrilogVersCSV', {type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
      if (err) {
        throw err;
      } else {
        res.json(data);
      }
    });
  });

  router.get('/claroline', function (req, res) {
    models.sequelize.query('SELECT * FROM clarolineVersCSV', {type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
      if (err) {
        throw err;
      } else {
        res.json(data);
      }
    });
  });

  router.post('/profilslogiciel', function (req, res) {
    var profil = req.body.name;
    var query = 'select l.nom from public.Profils p, public.Profils_Logiciels pl, public.Logiciels l where p.id_profil = pl.id_profil AND l.id_logiciel = pl.id_logiciel AND p.nom LIKE ?';
    models.sequelize.query(query, { replacements: [profil], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
      if (err) {
        throw err;
      } else {
        res.json(data);
      }
    });
  })
  router.post('/profilslogicielupdate', function (req, res) {
    var profil = req.body.profil;
    for (var attributename in req.body.logiciels) {
      profil += ',' + req.body.logiciels[attributename]
    }
    var query = 'select l.nom from public.Profils p, public.Profils_Logiciels pl, public.Logiciels l where p.id_profil = pl.id_profil AND l.id_logiciel = pl.id_logiciel AND p.nom LIKE ?';
    models.sequelize.query(query, { replacements: [profil], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
      if (err) {
        throw err;
      } else {
        var query = 'Select * from modificationProfilLogiciel(?)';
        models.sequelize.query(query, { replacements: [profil], type: models.sequelize.QueryTypes.SELECT }).then(function (data, err) {
          if (err) {
            throw err;
          } else {
            res.send("success")
          }
        });
      }
    });
  });

  module.exports = router;