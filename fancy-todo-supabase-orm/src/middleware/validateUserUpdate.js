const searchUsersController = async (req, res) => {
  try {
    const { name, email } = req.query;
    const results = await userService.searchUsers({ name, email });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
