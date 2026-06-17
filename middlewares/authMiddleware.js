exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "Veuillez vous connecter");
    return res.redirect("/login");
  }
  next();
};
