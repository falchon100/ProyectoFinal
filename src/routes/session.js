import { Router } from "express";
import { requireLogin,requireLogout } from "../middleware/auth.js";
import passport from "passport";
import {  
    getCurrent_Ctrl,
    getGithubCallback_Ctrl,
    getGithub_Ctrl,
    getLoginError_Ctrl,
    getLogin_Ctrl,
    getLogout_Ctrl,
    getProfile_Ctrl,
    getRegisterError_Ctrl,
    getRegister_Ctrl, 
    postLogin_Ctrl, 
    postRegister_Ctrl} from "../controllers/session.controller.js";

const sessionRouter = Router();

//utilizo el middleware requierelogout para que no pueda renderizar el registro ya que ya hay una session activa
sessionRouter.get('/register',requireLogout,getRegister_Ctrl)

//guardo los datos en user , y busco en la db si ya existe ese email, si ya existe envio error , y sino lo creo al usuario
sessionRouter.post('/register',passport.authenticate('register',{failureRedirect:"register-error"}),postRegister_Ctrl)

sessionRouter.get('/register-error',getRegisterError_Ctrl)
//utilizo el middleware requierelogout para que no pueda renderizar el login ya que ya hay una session activa
sessionRouter.get('/login',requireLogout,getLogin_Ctrl)

// Leo los datos del cliente y los de la db ,si no existe el mail renderizo error , y si los datos corresponden con la db lo traslado a product
//sino renderizo error
sessionRouter.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/login-error'}),postLogin_Ctrl)

sessionRouter.get('/login-error',getLoginError_Ctrl);

sessionRouter.get('/profile', requireLogin,getProfile_Ctrl);

sessionRouter.get('/logout',getLogout_Ctrl);

sessionRouter.get('/github',passport.authenticate('github',{scope :['user:email']}),getGithub_Ctrl)

sessionRouter.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/api/sessions/login-error'}),getGithubCallback_Ctrl);

// utilizo el middleware para que tenga session, 
sessionRouter.get('/current',requireLogin,getCurrent_Ctrl)

export default sessionRouter;