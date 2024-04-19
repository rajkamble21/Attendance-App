const jwt = require('jsonwebtoken');
const JWT_SECRET = 'this_is_the_secret_key_for_jwt';

const verifyToken = (req, res, next) =>{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message: "No token provided"})
    }
    jwt.verify(token.replace('Bearer ', ''), JWT_SECRET, (error, decoded)=>{
        if(error){
            return res.status(401).json({message:"Invalid token"})
        }
        req.user = decoded;
        next();
    })
}

module.exports = verifyToken;