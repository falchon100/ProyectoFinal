import ProductDao from "../DAO/ProductDao.js";
import CustomError from "../services/errors/customError.js";
import EErrors from "../services/errors/enums.js";
import { generateProductErrorInfo } from "../services/errors/info.js";


const productDao = new ProductDao();


//GET
export const getProduct_Ctrl =  async (req, res) => {
    const { limit } = req.query;
    const productos = await productDao.getProducts();
    limit ? res.send(productos.slice(0, limit)) : res.status(200).send(productos);
  }

export const getProductId_Ctrl =  async (req, res) => {
    try {
      const id = req.params.pid;
      const response = await productDao.getProductById(id);
      if (!response) {
        return res.status(400).send({status:'failed',payload:'no se encontro el producto ingresado'})
      } else {
        res.status(200).send(response);
      }
    } catch (error) {
      console.log(error);
    }
  }  

//POST


export const postProduct_Ctrl = async (req, res) => {
  try {    
    let { title, description, code, price, stock, category, thumbnails } =req.body;
  if (!title||!description||!code||!price||!stock||!category){
    CustomError.createError({
      name:`Error al registrar producto`,
      cause: generateProductErrorInfo({title, description, code, price, stock, category}),
      message: 'Error al intentar registrar un producto',
      code: EErrors.INVALID_TYPES
    })
    //ACA MANDO EL ERROR
  }else{
      const response =  await productDao.addProduct(title,description,code,price,stock,category,thumbnails);
        res.send({status:'success',payload:response})
  }
  
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }

  }
  
//UPDATE
export const PutProduct_Ctrl =  async (req, res) => {
    let producto = req.body;
    let id = req.params.id;
    const response = await productDao.updateProduct(id, producto);
    /*  const response = await producto.updateProduct(id, productoo); */
    if (response.status !== "producto actualizado") {
      res.status(404).send(response);
    } else {
      res.status(200).send(response);
    }
  }

//DELETE
export const DeleteProduct_Ctrl =  async (req, res) => {
    const id = req.params.pid;
    const response = await productDao.deleteProduct(id);
    if (response.status !== "Exitoso") {
      res.status(404).send(response);
    } else {
      res.status(200).send(response);
    }
  }
/*   export const DeleteProduct_Ctrl = async (req, res) => {
    const productId = req.params.pid;
    const user = req.session.user; // Obtener el correo electrónico o ID del usuario actual
  

      const product = await productDao.getProductById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      // Verificar si el usuario actual es el propietario del producto
      if (product.owner === user || req.session.admin) {
        // El usuario es el propietario o es un administrador, puede eliminar el producto
        const response = await productDao.deleteProduct(productId);
        return res.status(200).json(response);
      } else {
        return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
      }

  }; */
//

  