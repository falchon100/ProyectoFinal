import passport from "passport";
import local from 'passport-local';
import { createHash, isValidPassword, } from "../utils/utils.js";
import UserDao from "../DAO/UserDao.js";
import GithubStrategy from 'passport-github2'
import config from "./config.js";

const LocalStrategy = local.Strategy;

const initializePassport = ()=>{
    passport.use('register',new LocalStrategy(
        {passReqToCallback:true,usernameField:'email'},async(req,username,password,done)=>{
    try {
        const {first_name,last_name, email, age, password}= req.body;    
        let user ={
            first_name,
            last_name,
            email,
            age:age,
            password:createHash(password) // Utilizo la funcion de bycrpt para poder generarle un hasheo al password
        }   
        let userFound = await userDao.getByEmail(user.email);
        if(userFound){
            return done(null,false) //indicamos con passport que fallo ya que ya existe
        }
        let result = await userDao.createUser(user) // si no lo encuentra , es por que se puede crear
      return done(null,result)
    } catch (error) {
        return done('error al registrar el usuario :'+ error)
    }
        }
    ));

passport.use('login',new LocalStrategy({usernameField:'email'},async(username,password,done)=>{
    let result = await userDao.getByEmail(username)
    if (username === config.ADMIN_EMAIL && password === config.ADMIN_PASSWORD){
      return  done(null, { email: username, password })
        }
            if (!result){
                return done(null, false,);
            }
             if(isValidPassword(result,password)){ //envio el usuario encontrado y comparo su password hasheado,sino envio error
               delete result.password;
               console.log('email'+ username);
                return done(null,{email:username});
                }else{
                    return done(null, false);
            }
}));

passport.use('github',new GithubStrategy({
    clientID: 'Iv1.9d3ac51c603a8c71',
    clientSecret: '0febd62a4e595358248dca3cda17792afe5a2c01',
    scope:["user:email"],
    callbackURL:`${config.DOMAIN}/api/sessions/githubcallback` 
},async (accessToken,refreshToken,profile,done)=>{
    try {
      let userEmail = profile.emails[0].value; // nos da el email del usuario 
      let user = await userDao.getByEmail(userEmail) // y lo buscamos en la funcion
      if (!user){ // si no existe , lo registramos
        let newUser =  {
            first_name: profile._json.login,
            last_name: "",
            email: userEmail,
            password: '',
            age: 20,
            role:'user',
            last_connection: new Date().toString()
        }
        let result = await userDao.createUser(newUser)
        done(null,result) // una vez que tenemos el usuario le mandamos result
    }else{ //si el usuario ya se encuentra registrado 
        user.last_connection = new Date().toString();
        user.save();
        done(null,user) //no vamos a tener error y le pasamos user
      }
    } catch (error) {
        done(error)
    }
}))


passport.serializeUser((user,done)=>{
    done(null,user.email)
});
passport.deserializeUser(async(id,done)=>{
    let user = await userDao.getById(id);
    done(null,user)
})

}

export default initializePassport;

const userDao = new UserDao();

