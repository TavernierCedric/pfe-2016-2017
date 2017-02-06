router.post('/', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {text: req.body.text, complete: false};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query();
    // SQL Query > Select Data
    const query = client.query('');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
})
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup'
}));

app.post('/login', passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/login'
}));



function isLogged(req, res, next) {
   if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}