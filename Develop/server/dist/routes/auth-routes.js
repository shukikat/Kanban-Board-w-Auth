import { Router } from 'express';
import { User } from '../models/user.js'; //import the User model
import jwt from 'jsonwebtoken'; //access to jwt token
import bcrypt from 'bcrypt'; //import bcrypt library for hashing
export const login = async (req, res) => {
    // TODO: If the user exists and the password is correct, return a JWT token
    const { username, password } = req.body; //extracts username and password from request body 
    //get user from database by username (find the one that matches )
    const user = await User.findOne({
        where: { username },
    });
    //if user does not exist in databasse response will return that authentical failed
    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    //need to make sure that password is paired up with correct username
    const passWordIsValid = await bcrypt.compare(password, user.password);
    if (!passWordIsValid) {
        return res.status(401).json({ message: "User is not valid." });
    }
    //need to install node to ensure this functionality, getting Secret Key 
    const secretKey = process.env.JWT_SECRET_KEY || '';
    //creating token from jwt
    if (!secretKey) {
        return res.status(500).json({ error: 'Forbidden, key not configured' });
    }
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    return res.json({ token }) //token is set as json response with valid credentials
    ;
};
const router = Router();
// POST /login - Login a user
router.post('/login', login); //defines the login route 
export default router; //exports the router instance
