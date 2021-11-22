import jwt from 'jsonwebtoken';
import config from 'config';

export const AuthMiddleware = function (req:any, res:any, next:any){
    const token = req.header('x-auth-token');
    // console.log(token);
    if(!token) return  res.status(401).send('This user is not authenticated');
    
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey')); 
        req.user = decoded;
        // console.log(`This is the user decoded token ${req.user}`)
        next();
    } catch (error) {
       return res.status(400).send('This user token is not valid!')
    }
}