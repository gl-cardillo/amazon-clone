const jwt = require("jsonwebtoken");

function verifyToken(req) {
  try {
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader.split(" ")[1];
    if (token != "undefined" && token !== "null") {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return decoded;
    }
    return false;
  } catch (err) {
    return false;
  }
}

module.exports = verifyToken;
