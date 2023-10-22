import jwt from "jsonwebtoken";
import config from "../config/config.js";


export const generateEmailToken = (email)=>{
const emailToken = jwt.sign(email,config.JWT_SECRET,{expiresIn:'1h'})
return emailToken
}

export const verifyTokenMiddleware = async (req, res, next) => {
    const token = req.query.token; // Obtén el token de la URL
    if (!token) {
      return res.status(401).send({ error: 'Not Authorized' });
    }
  
    jwt.verify(token, config.JWT_SECRET, (error, decodedToken) => {
      if (error) {
        console.error("Error:", error);
        if (error.name === "TokenExpiredError") {
          // Token expirado, redirijo a la página de solicitud de cambio de contraseña
          return res.render('sendEmail',{message:'se acabo el tiempo del token, envie nuevamente el mail !'});
        }
        return res.status(403).send({ error: "No autorizado: Token inválido" });
      }
      
      req.user = decodedToken.user;
      next();
    });
  };