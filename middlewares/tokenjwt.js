const jwt = require("jsonwebtoken");

//JWT secret, à mettre dans un .env en production
const JWT_SECRET = "grosmotdepassesah";

//Middleware pour authentifier l'utilisateur
const authenticateJWT = (req, res, next) => {
  //Récupérer le token de cookie
  const token = req.cookies["token"];

  //Log le token
  console.log("Token from cookie ", req.cookies["token"]);

  if (!token) {
    return res.status(403).json({
      message: "no token provided",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; //Stocker les infos de l'utilisateur decodées dans l'objet de la requête
    next();
  });
};

module.exports = authenticateJWT;
