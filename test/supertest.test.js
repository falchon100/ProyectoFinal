import chai from "chai";
import supertest from "supertest";
import { faker } from '@faker-js/faker';
import session  from 'supertest-session';
import app from '../app.js'
import config from "../src/config/config.js";

const expect = chai.expect;
const requester = supertest(`${config.DOMAIN}${process.env.port}`);
const testSession = session(app); 

let prodID = "";
let cartId = ""; // inicializo variables vacias para luego modificarlas 

describe('Testing de Routers product, carts, sessions',()=>{

     describe('Test de Products', async()=>{
        it('El endpoint get api/products debe obtener todos los productos',async()=>{
            const {status,ok,_body} = await requester.get('/api/products')
            expect(status).to.equal(200);
            expect(ok).to.be.true;
            expect(_body).to.be.an('array');
            //verifico que el body sea un array que el estado sea 200
        })

        it('El endpoint POST api/products debe crear un producto en la db',async()=>{
            const login = await testSession.post("/api/sessions/login").send({
                email:"adminCoder@coder.com",
                password:"adminCod3r123"
            });
            expect(login.status).to.equal(302)
            expect(login.header["location"]).to.equal("/products") //Primero envio los datos de admin y luego verifico que sea 302 y redirija a productos

            const response = await testSession.post('/api/products').send({
                title:faker.commerce.product(),
                description:faker.commerce.productDescription(),
                code:faker.string.alpha(15),
                price:faker.commerce.price({ min: 100, max: 10000 }),
                stock:faker.string.numeric({ length:  { min: 1, max: 2 }, exclude: ['0'] }),
                category:faker.commerce.department(),
                thumbnails:faker.image.urlLoremFlickr({ category: 'product' })
            })
            expect(response.status).to.equal(200)
            expect(response._body.status).to.be.equals("success")
            prodID = response._body.payload._id;
            //genero un producto con faker y verifico que el estado sea 200  y el estado diga success
        })

        it('el endpoint GET en /api/products:id debe devolver el producto de la db',async()=>{
            const response = await requester.get(`/api/products/${prodID}`); 
            expect(response.status).to.equal(200);  
            expect(response.body._id).to.be.equal(prodID);
            expect(response.body).to.have.property('title');
            expect(response.body).to.have.property('description');
            expect(response.body).to.have.property('price');
            //utilizo el id del producto almacenado para buscarlo en la db y verifico que tenga algunas propiedades y el estado sea 200
        })

        it('el endpoint delete en /api/products:id debe eliminar el producto de la db',async()=>{
            const response = await testSession.delete(`/api/products/${prodID}`);
            expect(response.status).to.equal(200);
            expect(response._body.status).to.be.equals('Exitoso')
            //utilizo el mismo id de producto para probar borrar el mismo producto que cree y que sea 200  y exitoso el mensaje de status
        })  
     })

       //TEST DE CARTS

     describe('Test de Carts', async()=>{

        it('El endpoint Post api/carts debe crear un carrito ',async()=>{
            const response = await requester.post('/api/carts')
            expect(response.status).to.equal(200)
            expect(response.body.status).to.equal('Se agrego correctamente un carrito')
            //verifico que sea status 200 y que el estado envie ese text
        })


        it('El endpoint get api/carts debe obtener todos los carritos', async () => {
            const response = await requester.get('/api/carts');
            expect(response.status).to.equals(200);
            expect(response.ok).to.be.true;
            expect(response.error).to.be.false;
            expect(response.type).to.be.equals('application/json');
            
            // obtengo el ultimo carrito  que genere en el test anterior
            const lastCart = response.body[response.body.length - 1];
            // guardo su id
             cartId = lastCart._id;
        });
            //utilizo su id para testiar un carrito nuevo y verifico que tenga la propiedad _id y sea status 200
        it('El endpoint get api/carts/id debe obtener el carrito con ese id', async ()=>{
            const response = await requester.get(`/api/carts/${cartId}`)
            expect(response.body[0]).to.have.property("_id")
            expect(response.status).to.equal(200)
            expect(response.ok).to.be.true;
        })
            //Sigo utilizando el id de carrito para poder testear eliminar el mismo carrito que sea 200 el statuus y el mensaje sea success
        it('El endpoint Delete api/carts/id debe eliminar el carrito con ese id', async ()=>{
            const response = await requester.delete(`/api/carts/${cartId}`)
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('Success')
        })

     })

     describe(' Test de Session ',async ()=>{
            //genero usuarios randoms
        const newUser = {
            "first_name":faker.person.firstName(),
            "last_name":faker.person.lastName(),
            "age":faker.string.numeric({ length:  { min: 1, max: 2 }, exclude: ['0'] }),
            "email": faker.internet.email(),
            "password":faker.string.alpha()
        }
        //genero un usuario random pero con un mail ya duplicado en la db
        const userDuplicado = {
            "first_name":faker.person.firstName(),
            "last_name":faker.person.lastName(),
            "age":faker.string.numeric({ length:  { min: 1, max: 2 }, exclude: ['0'] }),
            "email":"PruebaMocha@gmail.com",
            "password":faker.string.alpha()
        }
        //genero un login de prueba que ya tengo en la db
        const pruebaLogin = {
            email: "prueba@gmail.com",
            password: "prueba"
        }

        it('El enpoint /api/sessions/register debe crear un usuario en la db',async()=>{
            if (!newUser.first_name || !newUser.last_name || !newUser.age || !newUser.email || !newUser.password) {
                expect(true).to.be.true; // si no se envia alguno de los datos requeridos deberia esperar true y salir de este test
                return; 
            }

            const response = await requester.post('/api/sessions/register').send(newUser)
            expect(response.status).to.be.equal(200) //envio el nuevo producto y debe dar status 200
    
        })
        it('El enpoint /api/sessions/register no debe dejar crear un usuario duplicados',async()=>{
            const response = await requester.post('/api/sessions/register').send(userDuplicado)
           expect(response.header.location).to.be.equals('register-error') // Debe redireccionar a error ya que estaba duplicado
           expect(response.status).to.be.equal(302) // debe dar un error ya que es un duplicado
        })

        it('El endpoint /api/sessions/login debe dejar ingresar a la app',async()=>{
            const response = await requester.post('/api/sessions/login').send(pruebaLogin)
            const cookies = response.headers['set-cookie']; // busco en los header que se haya guardado la cookie 
            const sessionCookie = cookies.find(cookie => cookie.includes('connect.sid'));
            expect(response.header.location).to.be.equals('/products') // si se direcciona a product es que estan correctos los parametros
            expect(response.status).to.be.equal(302);
            expect(cookies).to.be.an('array');
            expect(cookies.length).to.be.greaterThan(0);
            expect(sessionCookie).to.exist;
        })

        it('El endpoint /api/sessions/login no debe dejar ingresar a usuarios que no esten registrados',async()=>{
            const response = await requester.post('/api/sessions/login').send({email:"usuarioError",password:"passwordError"})
            expect(response.header.location).to.be.equals('/api/sessions/login-error') //debe direccionar a error ya que son datos invalidos
        })

        it('El endpoint /api/sessions/profile no debe estar accesible sin iniciar sesión', async () => {
            const response = await requester.get('/api/sessions/profile');
            expect(response.status).to.be.equal(401); // Debe dar un codigo de estado 401 ya que requiere autenticacion
        })

        it('El endpoint /api/sessions/logout debe cerrar la sesión del usuario', async () => {
            const response = await requester.get('/api/sessions/logout');
            expect(response.status).to.be.equals(200) // ya que es correcto
            expect(response.header).to.not.have.property('set-cookie'); // se verifica que realmente haya borrado la cookie
        })

     })


})

