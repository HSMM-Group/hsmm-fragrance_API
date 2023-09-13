const passport = require('passport');

const authMiddleware = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // Clear the cookie if the user is unauthorized
        res.clearCookie("auth-token");
        res.clearCookie("userId");
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user;
      next();
    })(req, res, next);
};

module.exports = authMiddleware;
