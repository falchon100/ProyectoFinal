import { cartModel } from "./model/carts.model.js";
import ProductDao from "./ProductDao.js";

const productAll = new ProductDao();

export default class CartsDao {
  constructor() {
    this.model = cartModel;
  }

  async readCarts() {
    try {
      let carts = await cartModel.find();
      return carts;
    } catch (error) {}
  }

  async getCartsById(id) {
    // SI NO EXISTE EL PRODUCTO LO MANDO COMO ERROR Y SINO ENVIO EL PRODUCTO ENCONTRADO
      let cart = await cartModel.find({ _id: id });
      if (!cart){
        throw new Error( 'no existe el carrito')
      }else{
        return cart
      }
  }

  async addCarts() {
    try {
      let cart = await cartModel.create({
        productos: { type: Array, default: [] },
      });
      return cart;
    } catch (error) {}
  }

  async addProductToCart(cid, pid) {
      //valido si existe producto
      let products = await productAll.getProducts();
      let productId = products.find((prod) => prod.id == pid);
      if (!productId) {
        return { status: "no existe ese producto" };
      }

      //valido si existe carrito
      let carritoId = await cartModel.findOne({ _id: cid });
      if (!carritoId) {
        throw new Error( 'no existe el carrito')
      /*   return "no existe el carrito"; */
      }

      //valido si ese producto existe en ese carrito y si no existe lo agrego y si existe le sumo quantity
      let prodSelected = carritoId.carts.find(
        (product) => product.products == pid
      );
      if (prodSelected) {
        //SI existe
        prodSelected.quantity++;
        await carritoId.save();
      } else {
        // No existe
        carritoId.carts.push({
          products: productId._id,
          quantity: 1,
        });
        await carritoId.save();
      }
  }

  async deleteProductToCart(cid, pid) {
    try {
      let carritoId = await cartModel.findOne({ _id: cid });
  
      if (!carritoId) {
        return "no existe el carrito";
      }
  
      // Encuentra todos los productos con el pid y elimínalos
      carritoId.carts = carritoId.carts.filter(product => !product.products.equals(pid));
  
      await carritoId.save();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCart(cid) {
    try {
      //obtengo el carrito enviado por parametro
      let carritoId = await cartModel.findOne({ _id: cid });
      // si tiene contenido , lo vacio
      if (carritoId.carts.length > 0) {
        carritoId.carts = [];
        await carritoId.save();
        return true
      } else {
        // y si esta vacio apretando una vez mas lo borro
        carritoId = await cartModel.deleteMany({ _id: cid });
        return true
      }
    } catch (error) {
      console.log(error);
    }
  }

  // UPDATE CARTS
  async updateCart(cid, prod) {
    try {
      let carritoId = await cartModel.findOne({ _id: cid });
      if (!carritoId) {
        console.log(carritoId);
        return { status: "no existe ese carrito" };
      }
      carritoId.carts = prod;
      await carritoId.save();
    } catch (error) {
      console.log(error);
    }
  }
  // UPDATE CARTS QUANTITY

  async updateproductToCart(cid, pid, quantity) {
    try {
      // leo el carrito seleccionado
      let carritoId = await cartModel.findOne({ _id: cid });
      // busco el indice del producto que llega por parametro
      let prodindex = carritoId.carts.findIndex(
        (product) => product.products == pid
      );
      // actualizo la cantidad del producto ,iterando con el indice dado
      carritoId.carts[prodindex].quantity = quantity;
      // actualizo la base de datos
      await carritoId.save();
    } catch (error) {
      console.log(error);
    }
  }

async resetCart(cid){
  try {
    let carritoId = await cartModel.findOne({ _id: cid });
    carritoId.carts = [];
    carritoId.save()
    return carritoId
  } catch (error) {
    console.log(error);
  }
}

}


