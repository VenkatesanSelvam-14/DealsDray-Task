const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  
  const authorization = req.headers.authorization;
  console.log(authorization);

  if (!authorization) return res.status(401).json({ error: "Token Not Found" });

  
  const token = authorization.split(" ")[1];
  console.log(token);

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   

    req.userid = decoded.id;
    req.userName = decoded.email;

    console.log(decoded.id + " " + decoded.email);


    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
};


const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 15 * 60 * 1000 });
};


const refreshToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: 24 * 60 * 60,
  });
};

module.exports = { generateToken, refreshToken, jwtAuthMiddleware };
