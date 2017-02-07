module.exports = function (app, passport){

router.post('/test', (req, res, next) => {
  const results = [];
  const data = {text: req.body.text, complete: false};
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('INSERT INTO items(text, complete) values($1, $2)',
    [data.["No. of interfaces"], data.complete]);
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

  app.post('/test', function (req, res) {
       console.log("post");
       var  data = req.body;
       console.log(data);
       var table = req.body.data;
       console.log(table);
}

function isLogged(req, res, next) {
   if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}