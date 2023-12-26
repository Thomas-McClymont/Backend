import passport from "passport";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    req.logger.info("Authentication");

    passport.authenticate(strategy, function (error, user, info) {
      console.log("Authentication in progress");
      if (error) {
        return next(error);
      }
      if (!user) {
        req.logger.warn("Autenticación failed");
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      req.logger.info("Autenticación successful");
      next();
    })(req, res, next);
  };
};

export const authorization = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      req.logger.warn("User not authenticated");
      return res
        .status(401)
        .send({ status: "error", message: "Unauthorizated" });
    }
    if (!roles.includes(req.user.role)) {
      req.logger.warn("User does not have the required role");
      return res
        .status(403)
        .send({ status: "error", message: "No permission" });
    }
    next();
  };
};
