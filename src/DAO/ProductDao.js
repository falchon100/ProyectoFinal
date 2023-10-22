import { productModel } from "./model/products.model.js";

class ProductDao {
  constructor() {
    this.model = productModel;
  }

  async getProducts() {
    let productos = await productModel.find();
    return productos;
  }

  async addProduct(
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    owner
  ) {
    let producto;
    try {
      producto = await productModel.create({
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails,
        owner
      });
    } catch (error) {
      console.log(error);
    }
    return producto;
  }

  async getProductById(id) {
    try {
      let productos = await productModel.findOne({ _id: id });
      return productos 
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    await productModel.deleteOne({ _id: id });
    return {
      status: "Exitoso",
      payload: `el producto '${id}' se borro correctamente`,
    };
  }

  async updateProduct(id, properties) {
    let producto;
    try {
      producto = await productModel.updateOne({ _id: id }, properties);
      return {status:"Success", msg:`Su product ID: ${id}, fue modificado`}
    } catch (error) {
      console.log(error);
    }
    return producto;
  }
}

export default ProductDao;
