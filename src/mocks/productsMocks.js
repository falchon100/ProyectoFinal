import { faker } from '@faker-js/faker';


export const generateProduct= ()=>{
    return {
        _id: faker.database.mongodbObjectId(),
        title:faker.commerce.product(),
        description:faker.commerce.productDescription(),
        code:faker.string.alpha(15),
        price:faker.commerce.price({ min: 100, max: 10000 }),
        stock:faker.string.numeric({ length:  { min: 1, max: 2 }, exclude: ['0'] }),
        category:faker.commerce.department(),
        thumbnails:faker.image.urlLoremFlickr({ category: 'product' })
    }
}

 export const generateProductsList=(cant)=>{
 let products = [];
 for (let i = 0; i < cant; i++) {
  let product = generateProduct();
  products.push(product)
}
return products
 }

   