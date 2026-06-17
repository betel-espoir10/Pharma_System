exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (!roles.includes(req.session.user.role)) {
      req.flash("error", "Accès refusé");
      return res.redirect("/dashboard");
    }

    next();
  };
};
