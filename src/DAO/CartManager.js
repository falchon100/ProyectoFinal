import fs from "fs";
import ProductManager from "./ProductManager.js";

const productAll = new ProductManager();

export default class CartManager {
  constructor() {
    this.path = "./carts.json";
  }
  //METODO PARA GENERAR ID
  generarId() {
    return Date.now();
  }

  async addCarts() {
    let cart = await this.readCarts();
    let nuevoCarrito = {
      id: this.generarId(),
      products: [],
    };
    cart.push(nuevoCarrito);
    await fs.promises.writeFile(this.path, JSON.stringify(cart));
    return { status: "Exitoso", msg: "Se agrego correctamente" };
  }

  async readCarts() {
    let cart = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(cart);
  }

  async getCartById(id) {
    let cart = await this.readCarts();
    let cartEncontrado = cart.find((elem) => elem.id == id);
    if (cartEncontrado) {
      return { status: "Exitoso", cartEncontrado };
    } else {
      return { status: "No se encontro el carrito" };
    }
  }

  async addProductToCart(cid, pid) {
    // VALIDO SI EXISTE PRODUCTO
    let products = await productAll.readProducts();
    let existe = products.some((prod) => prod.id == pid);
    if (!existe) {
      return { status: "no existe ese producto" };
    }

    // VALIDO SI EXISTE CARRITO
    let carritos = await this.readCarts();
    let index = carritos.findIndex((cart) => cart.id == cid);
    if (index == -1) {
      return { status: "no existe ese carrito" };
    }
    //BUSCO EL CARRITO CON EL INDICE OBTENIDO Y CREO UNA VARIABLE CON EL INDICE QUE TENGA EL MISMO PID
    if (carritos[index].products.some((prod) => prod.id == pid)) {
      // si en el carrito seleccionado ya esta ese producto , busco en todos los productos su indice y lo guardo en variable
      //para poder acceder y sumarle uno a la cantidad
      let variable = carritos[index].products.findIndex(
        (prod) => prod.id == pid
      );
      carritos[index].products[variable].quantity++;
      await fs.promises.writeFile(this.path, JSON.stringify(carritos));
    }
    //si no esta el producto en el carrito seleccionado, le agrego el producto con el PID y cantidad 1
    else {
      carritos[index].products.push({
        id: pid,
        quantity: 1,
      });
    }
    await fs.promises.writeFile(this.path, JSON.stringify(carritos));
    return carritos[index];
  }
}
