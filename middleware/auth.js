const jwt = require("jsonwebtoken");

function AuthMiddleware(req, res, next) {
   const requestHeader = req.headers["authorization"];
   const token = requestHeader && requestHeader.split(" ")[1];
   if (token == null) return res.status(401);

   jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
      if (err) return res.sendStatus(403);

      req.user = user;
      next();
   });
}

module.exports = AuthMiddleware;
