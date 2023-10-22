/* import mongoose from "mongoose";
import UserDao from "../src/DAO/UserDao.js";
import Assert from 'assert';
import config from "../src/config/config.js";
import { faker } from '@faker-js/faker';
import ProductDao from "../src/DAO/ProductDao.js";
import CartsDao from "../src/DAO/CartDao.js";

mongoose.connect(config.MONGO_URL);

const assert = Assert.strict;

describe('testing user Dao',()=>{
    before(function(){
        this.userDao = new UserDao();
    
    })

    it(' El dao de usuario debe retornar un array', async function(){
        const result = await   this.userDao.getAll()
        assert.strictEqual(Array.isArray(result),true)
    })

    it('El dao debe crear un usuario en la db', async function (){
        let newUser = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password:faker.string.alpha(),
            age: faker.string.numeric({ length:  { min: 1, max: 2 }, exclude: ['0'] })
        }
        const result = await this.userDao.createUser(newUser)
        assert.ok(result._id)
    })

    it('El dao debe poder buscar un usuario por id',async function(){
        let newUser = {
            first_name: "PruebaMocha",
            last_name: "PruebaMocha",
            email: "PruebaMocha@gmail.com",
            password: "PruebaMocha",
            age: 32
        }
        const result = await this.userDao.getByEmail(newUser.email);
        assert.strictEqual(result.email, newUser.email)
    })

})


describe('Testing de product Dao',()=>{
    before(function(){
        this.productDao = new ProductDao();
    })

    it(' El dao de productos debe retornar un array de todos los productos', async function(){
        const result = await   this.productDao.getProducts()
        assert.strictEqual(Array.isArray(result),true)
    })

    it(' El dao de productos debe poder agregar un producto a la db', async function (){
        let newProduct = {
            title:faker.commerce.product(),
            description:faker.commerce.productDescription(),
            code:faker.string.alpha(15),
            price:faker.commerce.price({ min: 100, max: 10000 }),
            stock:faker.string.numeric({ length:  { min: 1, max: 2 }, exclude: ['0'] }),
            category:faker.commerce.department(),
            thumbnails:faker.image.urlLoremFlickr({ category: 'product' })
        }
        const result = await this.productDao.addProduct(
            newProduct.title,
            newProduct.description,
            newProduct.code,
            newProduct.price,
            newProduct.stock,
            newProduct.category,
            newProduct.thumbnails)
        assert.ok(result._id)

    })

    it('El dao debe poder buscar un producto por id', async function () {
        //obtengo todos los productos y genero uno aleatorio 
        const products = await this.productDao.getProducts();
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        
       //uso el mtodo buscar por id y lo guardo 
        const result = await this.productDao.getProductById(randomProduct._id);
    
        // Verifico si se encontró el producto y si el ID coincide
        assert.ok(result);
        assert.strictEqual(result._id.toString(), randomProduct._id.toString());
    });
    
})


describe('Testing de Cart Dao',()=>{
    before(function(){
        this.cartDao = new CartsDao();
        this.productDao = new ProductDao();

    }) 

    it(' El dao de cart debe retornar un array de todos los carts', async function(){
        const result = await this.cartDao.readCarts()
        assert.strictEqual(Array.isArray(result),true)
    })

    it("El dao debe poder crear un carrito en la db", async function() {
        const result = await this.cartDao.addCarts();
        this.cartID = result._id.toString();
        assert.ok(result._id)
    })

    it('El DAO de carritos debe poder buscar un carrito por ID', async function () {
        // obtengo  un carrito existente
        const carts = await this.cartDao.readCarts();
        const cart = carts[0];
        // Busco el carrito por su ID
        const foundCart = await this.cartDao.getCartsById(cart._id);
        // Verifico que el carrito encontrado tenga el mismo ID que el carrito original
        assert.strictEqual(foundCart[0]._id.toString(), cart._id.toString());
    });

}) */