import { Router } from "express";
import { requiereAuth, requireLogin } from "../middleware/auth.js";
import {  
  base_Ctrl,
  cardId_Ctrl,
  chat_Ctrl,
  product_Ctrl,
  realTimeProducts_Ctrl } from "../controllers/views.controller.js";

const views = Router();

// VISTAS GET
views.get('/',base_Ctrl)
views.get("/realtimeproducts",realTimeProducts_Ctrl);
// SOLO EL USUARIO PEUDE ENVIAR MENSAJES AL CHAT
views.get("/chat",requiereAuth,chat_Ctrl);
views.get("/products",requireLogin,product_Ctrl);
views.get("/carts/:cid",cardId_Ctrl)


// TEST DE LOGGER
views.get('/loggerTest',(req,res)=>{
  req.logger.warn('este es un mensaje de tipo warn de')
  req.logger.info('este es un mensaje de tipo info de')
  req.logger.error('este es un mensaje de tipo error de')
  req.logger.http('este es un mensaje de tipo http')
  req.logger.warn('este es un mensaje de tipo warning')
  req.logger.debug('este es un mensaje de tipo debug')
  res.send('enviando Loggers por consola')
})

export default views;
