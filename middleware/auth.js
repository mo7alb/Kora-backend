const jwt = require("jsonwebtoken");

function AuthMiddleware(req, res, next) {
   const requestHeader = req.headers["authorization"];
   console.log("request headers ===>", requestHeader);
   if (requestHeader == undefined) return res.sendStatus(401);
   const token = requestHeader ? requestHeader.split(" ")[1] : null;

   if (token == null) return res.sendStatus(401);

   jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
      if (err) return res.status(403);

      if (!user) return res.status(401);
      req.user = user;
      next();
   });
}

module.exports = AuthMiddleware;
