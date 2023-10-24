
  const socket =io();

socket.on("cartUpdated", () => {
  // Recargar la página para reflejar los cambios en el carrito
  location.reload();
});
function deleteProduct(productId, user) {
  socket.emit("deleteProduct", { productId, user });
}




async function generateOrder(cid, user) {
  try {
    const response = await fetch(`/api/carts/${cid}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    });

    if (response.ok) {
      const data = await response.json();
     // si todo va bien redirije a el pago de stripe
      window.location.href = data.sessionUrl;
    } else {
     //si no es exitoso 
      const errorMessage = await response.text(); // obtenemos el mensaje de error del servidor
      alert(errorMessage); //y hacemos un alert por pantalla del error
    }
  } catch (error) {
    console.error('Error al generar la orden:', error);
  }
}


