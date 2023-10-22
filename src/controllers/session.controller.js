import  config  from  '../config/config.js';
import UserDTO from "../DAO/DTOS/userDTO.js";
import UserDao from "../DAO/UserDao.js";

const userDao = new UserDao();

// GETS
export const getRegister_Ctrl =  (req, res) => {
    res.render('register', {style:"base.css"})
}

export const getRegisterError_Ctrl =async(req,res)=>{
    res.render('register-error',{})
}

export const getLogin_Ctrl = async (req, res) => {
    res.render('login', {})
}

export const getLoginError_Ctrl =  async (req, res) => {
    res.render('login-error',{message:'El usuario o contraseña no son correctos'});
}

export const getProfile_Ctrl =  async (req, res) => {
    let user = await userDao.getByEmail(req.session.user);
    user = JSON.parse(JSON.stringify(user));
    res.render('profile', { user: user });
  }

export const getLogout_Ctrl = async(req, res) => {
    // antes de destruir la session actualizo la propiedad last conection
    if (req.session.user) {
        const user = await userDao.getByEmail(req.session.user);
        if(user){
            user.last_connection = new Date().toString();
            await user.save();
        }
    }

    req.session.destroy(error => {
        res.render('login',{message:'¡Deslogeado correctamente!'})
    })
}

export const getGithub_Ctrl = async (req,res)=>{}

export const getGithubCallback_Ctrl = async (req,res)=>{
    req.session.user = req.user.email;
    req.session.cart = req.user.cart;
    res.redirect('/products');
}

export const getCurrent_Ctrl = async(req,res)=>{
    const userEmail = req.session.user; //guardo la session en userEmail
    let result = await userDao.getByEmail(userEmail); //busco en la db si existe ese usuario
    let user = new UserDTO(result)
    if (!user) {
        // Si no se encuentra el usuario, devolver un mensaje de error
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.render('current',{user})
    
   /*    res.json(user);//si lo encuentra envio el json del usuario */
}

export const postRegister_Ctrl =  async (req, res) => {
    res.render('login',{statusSuccess:'Registrado Correctamente'})
    }

export const postLogin_Ctrl =  async (req, res) => {
    if (!req.user) res.render('login-error',);
    if (req.user.email==config.ADMIN_EMAIL){
        req.session.admin=true;
        req.session.user=req.user.email;
        //atualizo el last conection al ingresar
/*         const user = await userDao.getByEmail(req.user.email);
        user.last_connection = new Date().toString();
        await user.save(); */
        const user = 'admin'  //PRUEBA
        res.redirect('/products')
    }else{
        let user =await userDao.getByEmail(req.user.email)   // leo el usuario y guardo el carrito y el mail
        req.session.cart= user.cart;
        req.session.user = req.user.email;
        user.last_connection = new Date().toString();
        await user.save();
      res.redirect('/products')
    }
    }


