import { Router } from "express";
import { changeEmail,
        renderPassword,
        sendEmail, 
        sendEmail_ctrl
       } from "../controllers/email.controller.js";
import { verifyTokenMiddleware } from "../utils/jwt.js";

const emailRouter = Router();




emailRouter.post('/',changeEmail) //Ruta para cambio de contraseña
emailRouter.post('/mail',sendEmail) //Ruta Post para envio de Email
emailRouter.get('/sendEmail',sendEmail_ctrl) //Ruta renderizar vista envio email
emailRouter.get('/password',verifyTokenMiddleware, renderPassword);



export default emailRouter;