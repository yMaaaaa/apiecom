const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access Denied. Admins Only.",
    });
  }
  next();
};

module.exports = isAdmin;
