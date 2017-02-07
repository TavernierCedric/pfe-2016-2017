module.exports = function (app, passport){

app.post('/test2', (req, res, next) => {
  const results = [];
  const data = {text: req.body.text, complete: false};
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('INSERT INTO items(text, complete) values($1, $2)',
    [data.text, data.complete]);
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

     app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login'
    }));


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup'
    }));

  app.post('/matricule', function (req, res) {
       console.log("post");
       var matricule = req.body.matricule;
       /* recupere le sql en fct du matrile et le renvoyer en json 
       */
      
       console.log(matricule);
       res.json(matricule)
  });
app.post('/connexion', function (req, res) {
       console.log("post");
       var table = req.body;
       console.log(table);
       if(table.login=="test"&&table.mdp=="1234")
       res.json("reussis");
  });
  app.post('/deconnexion', function (req, res) {
       console.log("post");
       var table = req.body;
       console.log(table);       
       res.json("reussis");
  });
  /* csv inser en fct du csv */
  app.post('/csv', function (req, res) {
       console.log("post");
       var  data = req.body;
       console.log(data);
       var table = req.body.data;
       console.log(table);
  });
}

function isLogged(req, res, next) {
   if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}