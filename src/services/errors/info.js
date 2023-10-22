export  const generateProductErrorInfo = prod =>{
    let prodInfo = `uno o mas parametros no son validos
    -title :necesita recibir un String, recibio ${prod.first_name}
    -descrption: necesita recibir un String, Recibio: ${prod.last_name}
    -code: necesita recibir un String, recibio: ${prod.email}
    -price: necesita recibir un Number, recibio : ${prod.price}
    -stock: necesita recibir un Number, recibio : ${prod.stock}
    -category: necesita recibir un String, recibio :${prod.category}`
    return prodInfo
}