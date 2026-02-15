const catchAsync = (fn) => (req, res, next) => { // parameter fn adalah sebuah fungsi yang akan dibungkus 
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;
