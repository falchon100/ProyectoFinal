
//si hay una session activa , puede continuar
export const requireLogin = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        res.status(401).render('login', { status: 'Necesita Logearse, para ver los productos'})
    }
}
//si no hay una session , puede continuar
export const requireLogout = (req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        res.render('profile',{status:'Ya tienes una session abierta'});
    }
}

export const requireAuthAdmin = (req,res,next)=>{
    if (req.session.admin){
        next();
    }else{
        res.status(400).json({status:"failed",msg:"solo el admin puede modificar productos"})
    }
}

export const requiereAuth = (req,res,next)=>{
    if (req.session.admin){
      return  res.json({status:"failed",msg:"No puede ingresar"})
    }   
else{
    next();
}
}
