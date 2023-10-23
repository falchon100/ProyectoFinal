import express from "express";
import cartsRouter from "./src/routes/carts.js";
import productsRouter from "./src/routes/products.js";
import handlebars from "express-handlebars";
import views from "./src/routes/views.js";
import { Server } from "socket.io";
import ProductManager from "./src/DAO/ProductManager.js";
import mongoose from "mongoose";
import MessageDao from "./src/DAO/MessageDao.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionRouter from "./src/routes/session.js";
import passport from "passport";
import initializePassport from "./src/config/passport.config.js";
import config from "./src/config/config.js";
import cookieParser from "cookie-parser";
import CartsDao from "./src/DAO/CartDao.js";
import mockRouter from "./src/routes/mock.js";
import errorHandler from './src/middleware/errors/errors.js';
import { addLogger, logger } from "./src/utils/logger.js";
import emailRouter from "./src/routes/email.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from 'swagger-ui-express';
import { swaggerOptions } from "./src/utils/swagger-options.js";
import cors from "cors"
import userRouter from "./src/routes/users.js";
import UserDao from "./src/DAO/UserDao.js";

const app = express();
const PORT = config.port || 8081;
app.use(addLogger)
app.use(cors())

const cartDao = new CartsDao();
const server = app.listen(PORT, () => logger.info(`Servidor escuchando puerto ${config.DOMAIN}`));
// io sera el servidor para trabajar con socket
const io = new Server(server);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(errorHandler)

const specs= swaggerJSDoc(swaggerOptions);
app.use('/apidocs',swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// configuracion de session y mongoStore
app.use(session({
  store: MongoStore.create({
    mongoUrl: config.MONGO_URL,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 3600
}), 
  secret: config.KEY_SECRET, //Defino la clave de encripción
  resave:true, //resave, define si la sesion caduca por inactidad
  saveUninitialized:false //Permite guardar cualquier sesion, aún cuando no tenga información.
}))
initializePassport(); //inicializo passport
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


//establezco los endpoints de los Routers
app.use("/mockingproducts",mockRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/email",emailRouter);
app.use("/api/users",userRouter)
app.use("/", views);
app.use('/api/sessions', sessionRouter)
//configuro handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static("./src/public"));

const userdao = new UserDao();

mongoose
  .connect(
    config.MONGO_URL
  )
  .then(() => logger.info("database connect "))
  .catch((error) => logger.error(error));

// el on significa que esta escuchando que pase algo en este caso escucha connection y trasmite el mensaje nuevo cliente conectado
io.on("connection", async (socket) => {
  logger.info("nuevo cliente conectado");

  // Envio la lista productos a traves de listProduct
  const product = await productos.getProducts();
  socket.emit("listProduct", product);

  socket.on("historial", async () => {
    io.emit("messageLogs", await Messages.getMessages());
  });

  socket.on("message", async (data) => {
    await Messages.addMessages(data.user, data.message);
    io.emit("messageLogs", await Messages.getMessages());
  });

  // escucho el eliminarProducto que trae el Id cliqueado para poder borrarlo
  socket.on("eliminarProducto", async (id) => {
    await productos.deleteProduct(id);
  });

  //escucho los datos del socket que me trae todos los values para poder agregar un nuevo producto
  socket.on("addproduct", async (data) => {
    await productos.addProduct(
      data.title,
      data.description,
      data.code,
      data.price,
      data.stock,
      data.category,
      data.thumbnails
    );
  });

/*   socket.on("generateOrder", async (cid,user) => {
    try {
      const response = await fetch(`http://localhost:${process.env.port}/api/carts/${cid}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({ user }) 
      });
  
      if (response.ok) {
        // Orden generada exitosamente
        socket.emit("orderGenerated", { success: true });
      } else {
        // Error al generar la orden
        socket.emit("orderGenerated", { success: false });
      }
    } catch (error) {
      logger.error(error);
      socket.emit("orderGenerated", { success: false });
    }
  }); */

  socket.on("deleteProduct", async ({ productId, user }) => {
    try {
      // Realizar la eliminación del producto del carrito
      await cartDao.deleteProductToCart(user, productId);
  
      // Emitir evento de actualización del carrito
      socket.emit("cartUpdated");
  
      // Emitir mensaje de éxito a quien eliminó el producto
      socket.emit("productDeleted", { success: true });
    } catch (error) {
      logger.error(error);
      // Emitir mensaje de error a quien eliminó el producto
      socket.emit("productDeleted", { success: false });
    }
  });

});







//inicializo la clase
const productos = new ProductManager();
const Messages = new MessageDao();

export default app