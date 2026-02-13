const addTokenToHeader = (req, res, next) => {
    // if (req.user && req.user.tokens && req.user.tokens.access && req.user.tokens.access.token) {
    // }
    const token = req.user.tokens.access.token;
    req.headers['Authorization'] = `Bearer ${token}`;
    next();
  };

  module.exports = {
    addTokenToHeader,
    
  };
  