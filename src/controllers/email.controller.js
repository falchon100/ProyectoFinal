import UserDao from "../DAO/UserDao.js";
import config from "../config/config.js";
import { sendMail } from "../services/email.js";
import { generateEmailToken } from "../utils/jwt.js";
import { createHash, isValidPassword } from "../utils/utils.js";



const userDao = new UserDao(); //llamo la instancia de userDao

export const changeEmail= async(req,res)=>{
        const {email,password}=req.body;  //leo el mail y password que llega en el formulario
    const emailDb = await userDao.getByEmail(email)//lo busco en la db
    if(!emailDb){//si no se encuentra envio error y renderizo la pagina con el error
        req.logger.error('No se encontro ese email en nuestros registros')
        res.render('password',{mesage:'No se encontro ese email en nuestros registros!'})
    }else{
      if(isValidPassword(emailDb,password)){//utilizo la funcion isvalidpassword para verificar si el email ingesado y el password son los mismos que en la db
      res.render('password',{mesage:'Error: Debe ingresar una contraseña diferente!!'})// si son los mismo envio mensaje
      }else{
        emailDb.password= createHash(password)   //si el password es diferente le hago un nuevo hash y lo actualizo en la db
        emailDb.save();
        res.send('Felicidades la contraseña ha sido cambiada!')
      }
    }
}


export const sendEmail = async(req,res)=>{
  let email = req.body.email;
  const emailToken = generateEmailToken({email:email})
  let options = {
    from: 'test email <ovnicrofordz@gmail.com>',
    to: email,
    subject: 'Cambio de contraseña',
    html:`<div>
    <h1>Has solicitado un cambio de contraseña</h1>
    <p>si usted necesita cambiar el password clickee el siguiente link:</p>
    <a href="${config.DOMAIN}/api/email/password?token=${emailToken}">Nueva Contraseña</a>
    </div>`
    
  }
let result = await sendMail(options)
  res.send(result)
}





export const renderPassword = async(req,res)=>{
  res.render('password')
}

export const sendEmail_ctrl = async (req,res)=>{
 /*  res.render('sendEmail') */
 res.render('products')
}