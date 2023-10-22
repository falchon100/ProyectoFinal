import { createHash } from "../utils/utils.js";
import CartsDao from "./CartDao.js";
import { userModel } from "./model/user.model.js";


export default class UserDao{
 constructor (){
    this.model= userModel;
 }
async getAll(){
    let result;
    try {
        result = await userModel.find()
    } catch (error) {
        console.log(error)
    }
    return result;
}

async getByEmail(email){
    let result;
    try {
        result = await userModel.findOne({ email })
    } catch (error) {
       return {status:'error',message:'No se encontro ese email registrado'}
    }
    return result; 
}

async createUser(user){
    try {
    let cartId = await cartDao.addCarts()
    let newUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        age: user.age,
        cart:cartId._id,
        last_connection:user.last_connection
    }
    let result = await userModel.create(newUser)
    return result;
    } catch (error) {
        console.log(error)
    }
}

async getById(id){
    let result;
    try {
        result = await userModel.findOne({id})
    } catch (error) {
        console.log(error)
    }
    return result;
}


async updateUser(email,newEmail){
    let result;
    try {
        result = await userModel.findOne({ email })
        result.email=  createHash(newEmail);
        result.save();
    } catch (error) {
       return {status:'error',message:'No se encontro ese email registrado'}
    }
    return result; 
}
  

async deleteUser(email) {
    let result = await userModel.deleteOne({email})
    return result

  }

}

const cartDao = new CartsDao();


