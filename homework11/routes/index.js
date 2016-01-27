
/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  var user = {
    username: ''
  };
  if (name == 'signUp' || name == 'signIn') {
    res.render('partials/' + name, {user: user});
  } else {
    res.render('partials/' + name);
  }
};