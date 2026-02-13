

const checkAuthenticate = (req, res, next) => {
    console.log('User Authenticated:', req.isAuthenticated());
      if (req.isAuthenticated()) {
      console.log('user is auth');
      return next()
    } else {
      console.log('user is not auth');
      res.redirect("/auth/login");
    }
  };
  
  const checkNotAuthenticate = (req, res, next) => {
      if (req.isAuthenticated()) return res.redirect('/');
      next();
  };
  
  const adminRoleLocal = (req, res, next) => {
    if (req.user.role === 'admin') return next();
  
    res.redirect('/');
  };

  module.exports={
    checkAuthenticate,
    checkNotAuthenticate,
    adminRoleLocal,
  }