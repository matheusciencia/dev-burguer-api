import jwt from 'jsonwebtoken';
import authConfig from './../config/auth.js';

const authMiddleware = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Token is not provided' });
  }

  const token = authToken.split(' ')[1];

  try {
    jwt.verify(token, authConfig.secret, (error, decoded) => {
      if (error) {
        throw Error();
      }

      req.userName = decoded.name;
      req.userId = decoded.id;
      req.isUserAdmin = decoded.admin;
    });
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid Token' });
  }

  return next();
};

export default authMiddleware;
