import jwt from 'jsonwebtoken';
import errorHandler from './errors.js';

export const verifyToken = (req, res, next) => {
  console.log("token")
  const token = req.cookies.access_token;
  console.log("token-end")
  console.log(token);
  if (!token) return next(errorHandler(401, 'Unauthorized'));

  const data = jwt.verify(token, process.env.JWT_SECRET);
  console.log(data);
  console.log(data.user.id);
  req.user = data.user;
  console.log(req.user.id);
  
  next();
};