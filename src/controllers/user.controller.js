import CartsDao from "../DAO/CartDao.js";
import UserDao from "../DAO/UserDao.js";
import { sendMail } from "../services/email.js";

const userDao = new UserDao;
const cartDao = new CartsDao;

 export const updateCtrl=  async (req, res) => {
    const uid = req.params.uid;
    const files = req.files;
    if (!files) {
      return res.status(400).json({ error: "No se han proporcionado archivos" });
    }
  
    let user = await userDao.getByEmail(uid);
  
    const imageInfoArray = files.map((file) => ({ //hago un nuevo array ya que pueden venir varios archivos
      name: file.originalname,
      reference: file.filename,
    }));
  
    user.documents.push(...imageInfoArray); // Agrego los nuevos archivos al arreglo de documentos
    user.save(); //actualizo la db
   res.render('profile',({user: JSON.parse(JSON.stringify(user)),statusSuccess:'Se agrego correctamente'}))
  }


 export const handlePremium = async(req, res) => {
    //Tomo el usuario por pametro sino lo encuentra envio un usuario no encontrado
    const uid = req.params.uid;
    let user = await userDao.getByEmail(uid);
  if(!user){
    return res.status(400).json({msg:' usuario no encontrado'})
  }
    //si el usuario es usuario valido que tenga los 3 documentos
    if (user.role ==='user'){
    const identification = user.documents.some(doc=>doc.reference.includes('identification'))
    const proofOfAddress = user.documents.some(doc=>doc.reference.includes('proofOfAddress'))
    const accountStatus = user.documents.some(doc=>doc.reference.includes('accountStatus'))
    //si los tiene procede a cambiar a premium y envio mensaje de success
    if(identification&&proofOfAddress&&accountStatus){
      user.role='premium'
    await  user.save()
      res.status(200).render('profile',({user: JSON.parse(JSON.stringify(user)),statusSuccess:'Felicidades ahora es Premium'}))
    }else{
      //si falta alguno de los documentos envio mensaje de failled
      res.status(400).render('profile',({user: JSON.parse(JSON.stringify(user)),statusFailled:'Debe cargar Identificación, Comprobante de domicilio y Comprobante de estado de cuenta para actualizar a premium'}))
    }

  }else{
    //si el usuario ya es premium y clickea nuevamente envio failled que ya es premium
    res.status(400).render('profile',{user: JSON.parse(JSON.stringify(user)),statusFailled:'Usted ya es premium!'});
  }
   }
   // creo un dto para obtener solamente nombre correo y tipo de cuenta de los usuarios
   function createUserDTO(user) {
    return {
        nombre: `${user.first_name} ${user.last_name}`,
        correo: user.email,
        tipo_de_cuenta: user.role,
        last_connection: user.last_connection
    };
}


   export const getUsers = async (req, res) => {
    try {
        // Obtén todos los usuarios desde la base de datos
        const users = await userDao.getAll();

        // Mapea los usuarios a DTOs
        const userDTOs = users.map(user => createUserDTO(user));

        res.send(userDTOs);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los usuarios");
    }
};

  export const deleteInactive = async (req,res)=>{
    const dateTwoDays = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const users = await userDao.getAll();
    
    const userFilterTwoDays = users.filter((user)=>{
     return user.last_connection < dateTwoDays;
    })


    userFilterTwoDays.forEach(async(user)=>{
      const mailOptions = {
        from: 'test email <ovnicrofordz@gmail.com>',
        to: user.email,
        subject: 'Eliminación de cuenta por inactividad',
        html: `
        <div>
        <h2>Hola ${user.email}!!</h2>
            <p>Hemos tenido que eliminar su cuenta ya que lleva 2 dias de inactividad</p>
            <img src="https://images.squarespace-cdn.com/content/v1/51cdafc4e4b09eb676a64e68/1470175715831-NUJOMI6VW13ZNT1MI0VB/image-asset.jpeg?format=2500w" width="200px" alt="carita triste">
            <p>pero nose preocupe puede crear una nuevamente en ...</p>
            </div>`
        };
        await sendMail(mailOptions)
        await cartDao.deleteCart(user.cart)
        await userDao.deleteUser(user.email)

    })

    res.json({dateTwoDays,userFilterTwoDays})
  }


  export const setUsers = async (req,res)=>{
    const users = await userDao.getAll();
    res.render('setusers', { users: JSON.parse(JSON.stringify(users)) ,style:"base.css"})
  }



  export const changerole = async (req, res) => {
    const email = req.params.email;
  
    try {
      const usuario = await userDao.getByEmail(email);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      if (usuario.role === 'user') {
        usuario.role = 'premium';
      } else {
        usuario.role = 'user';
      }
      await usuario.save();
  
      return res.status(200).json({ message: 'Rol cambiado con éxito' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al cambiar el rol' });
    }
  };

  export const deleteUser = async (req, res) => {
    const email = req.params.email;
  
    try {
      const response = await userDao.deleteUser(email);
      console.log(response);
      if (response.success) {
        console.log('Usuario eliminado correctamente');
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
      } else {
        console.error('Error al eliminar el usuario');
        res.status(500).json({ message: 'Error al eliminar el usuario' });
      }
    } catch (error) {
      console.error('Error en deleteUser:', error);
      res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
  };