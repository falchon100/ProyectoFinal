import CartsDao from "../DAO/CartDao.js";
import ProductDao from "../DAO/ProductDao.js";
import TicketDao from "../DAO/TicketDao.js";
import crypto from 'node:crypto'
import PaymentService from "../services/payment.js";
import config from "../config/config.js";

const paymentService = new PaymentService;
const productsDao= new ProductDao;
const cartDao = new CartsDao;
const ticketDao = new TicketDao;
//GETS



export const getCarts_Ctrl = async (req, res) => {
    res.send(await cartDao.readCarts());
 }

 export const getCartsId_Ctrl = async (req, res) => {
    try {
      const id = req.params.cid;
      const response = await cartDao.getCartsById(id);
      res.send( response );
    } catch (error) {
      res.status(404).send({ error: 'El carrito no existe' });
    }
  }


//POST


export const generateOrder = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartDao.getCartsById(cid);
    if (!cart || cart.length === 0) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const Cart = cart[0].carts;
    const productsToProcess = [];
    const productsNotProcessed = [];


   for (const producto of Cart) {
    const product = await productsDao.getProductById(producto.products._id); //me traigo el producto con el id del carrito seleccionado
    if (!product) {
      // Si el producto no existe en la base de datos, lo agregamos a productsNotProcessed
      productsNotProcessed.push(producto);
    } else if (producto.quantity > product.stock) {
      // Si la cantidad solicitada es mayor que el stock del producto, lo agregamos a productsNotProcessed
      productsNotProcessed.push(producto);
    } else {
      // Si la cantidad solicitada es menor o igual al stock del producto, lo agregamos a productsToProcess
      productsToProcess.push(producto);
    }
  }

  console.log("productsToProcess", productsToProcess);
  console.log("productsNotProcessed", productsNotProcessed);

    // Crear el ticket si hay productos para procesar
    if (productsToProcess.length > 0) {
      const session = await paymentService.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode:"payment",
        line_items:productsToProcess.map(item=>({
          price_data: {
            currency:  'usd',
            product_data:{
              name:item.products.title,
              description:item.products.description
            },
            unit_amount:item.products.price *100,
          },
          quantity: item.quantity,
        })),
        payment_intent_data: {

        },
        success_url:`${config.DOMAIN}${config.port}/api/carts/purchase/success`,
        cancel_url:`${config.DOMAIN}${config.port}/api/carts/purchase/cancel`
      });
      res.json({ sessionUrl: session.url });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al generar la compra' });
  }
}

export const orderSuccess_Ctrl = async(req,res)=>{
  
  const cid = req.session.cart;
  const cart = await cartDao.getCartsById(cid);
  const Cart = cart[0].carts;

  const productsToProcess = [];
  const productsNotProcessed = [];


  for (const producto of Cart) {
    const product = await productsDao.getProductById(producto.products._id); //me traigo el producto con el id del carrito seleccionado
    if (!product) {
      // Si el producto no existe en la base de datos, lo agregamos a productsNotProcessed
      productsNotProcessed.push(producto);
    } else if (producto.quantity > product.stock) {
      // Si la cantidad solicitada es mayor que el stock del producto, lo agregamos a productsNotProcessed
      productsNotProcessed.push(producto);
    } else {
      // Si la cantidad solicitada es menor o igual al stock del producto, lo agregamos a productsToProcess
      productsToProcess.push(producto);
    product.stock-=producto.quantity 
    product.save()
    await cartDao.deleteProductToCart(cid,producto.products._id)

    }
  }

    // Calcular el total de la compra
    const totalSum = productsToProcess.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.products.price * currentValue.quantity;
    }, 0);

    if (productsToProcess.length > 0) {
      const ticketData = {
        code: crypto.randomUUID(),
        purchase_datetime: new Date().toString(),
        amount: totalSum,
        purchaser: req.session.user//email del usuario
      };
      await ticketDao.createTicket(ticketData);
    }
    let datos = JSON.parse(JSON.stringify(productsToProcess));
  res.render('success',{user:req.session.user,totalSum,datos})
}

export const cancel_ctrl = async(req,res)=>{
  const user = req.session.user;

  res.render('cancel',{user})
}


//////////////////////////////////////////////////////////

  export const postCarts_Ctrl =  async (req, res) => {
    await cartDao.addCarts()
    res.status(200).send({status:'Se agrego correctamente un carrito'} )};

  export const postCartsProd_Ctrl =  async (req, res) => {
        try {
          let cartId = req.params.cid;
          let productId = req.params.pid;
          const response = await cartDao.addProductToCart(cartId, productId)
          res.status(200).send({status:'success',msg:'se agrego correctamente'})
        } catch (error) {
          res.status(404).send({ error: 'El carrito no existe' });
        }
        }
//DELETE
export const deleteCarts_Ctrl =  async (req, res) => {
    let cartId = req.params.cid;
   if (await cartDao.deleteCart(cartId)){
       res.json({status:'Success', msg:'Carrito eliminado'});
   }else
   res.json({status:'Failure', msg:'No existe el carrito a eliminar'})
  }

export const deleteCartsProd_Ctrl =  async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    const response = await cartDao.deleteProductToCart(cartId, productId)
    if (response!== "no existe ese producto"){
      res.status(200).send({status:`Se borro correctamente una cantidad del producto ${productId}`}  )
    }
  }

//UPDATE
export const putCarts_Ctrl =  async (req, res) => {
    let cartId = req.params.cid;
    let product = req.body;
    res.send(await cartDao.updateCart(cartId, product));
  }

export const putCartsProd_Ctrl =  async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let quantity = req.body.quantity;
    res.send(await cartDao.updateproductToCart(cartId, productId, quantity));
  }

  export const getResetcart= async (req,res)=>{
    const cid = req.params.cid;
    const response = await cartDao.resetCart(cid);
    res.json(response)
  }