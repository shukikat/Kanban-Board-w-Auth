import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // TODO: verify the token exists and add the user data to the request object
  //gives the header from the request
  const authHeader=req.headers.authorization;

  // if header is present splits the token up and gets the header portion of the token
  if (authHeader) {
    const token=authHeader.split(' ')[1];
    const secretKey=process.env.JWT_SECRET_KEY || ''; 
    //check to ensure secretKey is defined
    if (!secretKey) {
      return res.status(500).json({error: 'Internal server error: JWT secret key not configured.'})
    }

  //verify the JWT token
  jwt.verify(token, secretKey, (err, user)=> {
    if(err) {
      return res.status(403).json({error: 'Forbidden: Invalid token.'}); 
    }

    //says is not error this pairs the User with the token
    req.user=user as JwtPayload;
    next ();
  
  });

} else {
  return res.sendStatus(401).json({error: 'Token not valid.'});
}

};