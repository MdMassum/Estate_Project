import jwt from 'jsonwebtoken';
import errorHandler from './errors.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  const data = jwt.verify(token, process.env.JWT_SECRET);
  req.user = data.user;
  
  next();
};