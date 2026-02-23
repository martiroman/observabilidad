const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ message: "Debe proveer un Token" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, req.app.get("secretKey"), function (error, payload) {
    if (error) {
      return res.status(401).json({ message: error.message });
    } 
  }); 

  next();
  return;
}


module.exports = {
  verifyToken
};