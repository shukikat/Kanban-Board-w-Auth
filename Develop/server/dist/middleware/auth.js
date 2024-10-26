import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
    // TODO: verify the token exists and add the user data to the request object
    //gives the header from the request
    const authHeader = req.headers.authorization;
    // if header is present splits the token up and gets the header portion of the token
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const secretKey = process.env.JWT_SECRET_KEY || '';
        //check to ensure secretKey is defined
        // if (!secretKey) {
        //   return res.sendStatus(500)
        // }
        //verify the JWT token
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            //says is not error this pairs the User with the token
            req.user = user;
            return next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
