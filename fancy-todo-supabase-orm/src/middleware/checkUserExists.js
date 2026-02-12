const userService = require("../service/user.service");

const checkUserExists = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({
          error: "Todo cannot be created because the user is not found",
        });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = checkUserExists;
