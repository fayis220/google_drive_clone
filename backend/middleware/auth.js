const jwt = require("jsonwebtoken");

const userRequired = async (req, res, next) => {
  try {
    const isAuthorization =
      req.headers.authorization || req.headers.Authorization;
    if (!isAuthorization)
      return res.unAuthorized({ message: "No token provided." });
    const token = isAuthorization.split(" ")[1];
    if (!token || token == "undefined")
      return res.unAuthorized({ message: "No token provided." });
    const decodedData = jwt?.verify(token, process.env.JWT_SECRET);
    if (!decodedData?.id)
      return res.unAuthorized({ message: "Cannot verify Access token" });
    return next();
  } catch (error) {
    console.log(error);
    res.internalServerError();
  }
};

module.exports = {
  userRequired,
};
