const socket = io();
const listProduct = document.getElementById("productContainer");

// tomo los productos del lado del servidor y los renderizo , ta bien reseteo el contenido de listProduct para que no se sobreescriba
const renderProduct = (productData) => {
  listProduct.innerHTML = "";
  const html = productData.map((productinfo) => {
    listProduct.innerHTML += `<div class="col my-3">
    <div class="card mx-auto" style="width: 18rem;">
        <img src=${productinfo.thumbnails} class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${productinfo.title}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">$${productinfo.price} </h6>
            <p class="card-text">${productinfo.description}</p>
            <p class="card-text">Stock:${productinfo.stock}</p>
            <a href="#" class="btn btn-primary">Comprar</a>
            <a href="#" class="btn btn-danger" onclick=eliminarId(${productinfo.id}) " >Eliminar</a>
        </div>
    </div>
    </div> `;
  });
};
socket.on("listProduct", renderProduct);

//hago una funcion que tomo el id y lo guardo en una variable , y esa variable la envio como dato al servidor
const eliminarId = (id) => {
  console.log(id);
  const idClicked = id;
  socket.emit("eliminarProducto", idClicked);
};

//primero selecciono el form
const form = document.querySelector("form");
//al boton enviar del formulario le cree un evento que guarde los values ingresados
document.getElementById("boton").addEventListener("click", () => {
  const title = form.elements.title.value;
  const description = form.elements.description.value;
  const code = form.elements.code.value;
  const price = form.elements.price.value;
  const stock = form.elements.stock.value;
  const category = form.elements.category.value;
  const thumbnails = form.elements.thumbnails.value;

  // esos datos guardados en variables los envio al servidor a traves de "addproduct"
  socket.emit("addproduct", {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  });
});

