import { Router } from "express";
import { 
  DeleteProduct_Ctrl,
  PutProduct_Ctrl,
  getProductId_Ctrl,
  getProduct_Ctrl,
  postProduct_Ctrl } from "../controllers/products.controller.js";
import { requireAuthAdmin } from "../middleware/auth.js";

const productsRouter = Router();

//GETS  
productsRouter.get("/",getProduct_Ctrl);
productsRouter.get("/:pid",getProductId_Ctrl);

//POST SOLO EL ADMIN PUEDE AGREGAR / BORRAR / MODIFICAR PRODUCTOS
productsRouter.post("/",requireAuthAdmin, postProduct_Ctrl);

//DELETE SOLO EL ADMIN PUEDE AGREGAR / BORRAR / MODIFICAR PRODUCTOS
productsRouter.delete("/:pid",requireAuthAdmin,DeleteProduct_Ctrl);

//PUTT SOLO EL ADMIN PUEDE AGREGAR / BORRAR / MODIFICAR PRODUCTOS
productsRouter.put("/:id",requireAuthAdmin,PutProduct_Ctrl);

export default productsRouter;
