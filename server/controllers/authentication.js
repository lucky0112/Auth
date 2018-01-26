const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timeStamp = new Date().getTime();
  console.log(config);
  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret);
}

exports.signin = function (req, res, next) {
  res.send({ token: tokenForUser(req.user) }); 
}


exports.signup = function (req,res,next) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password){
    return res.status(422).send({ error: 'Email and Password Cannot be empty' });
  }

  //See if a user with the given email exists
  User.findOne({ email:email },function (err,existingUser) {
    if (err){ next(err); }
    //Email Exist Return error
    if (existingUser){
      return res.status(422).send({ error:'Email is in use' });
    }
    //Email doesn't exist ,create and save
    const user = new User({
      email: email,
      password: password
    });
    user.save(function(err) {
      if (err){ return next(err); }
      //Respond to request indicating the user was created
      res.json({token: tokenForUser(user)});
    });
  })
}
