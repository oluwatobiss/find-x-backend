const createUser = async (req, res, next) => {
  console.log("=== createUser controller ===");
  console.log(req.body);
};

module.exports = { createUser };
