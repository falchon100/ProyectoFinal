
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
      // se redirige  al usuario a la URL de la sesión de Stripe
      window.location.href = data.sessionUrl;
    } else {
      // si la solicitud no es exitosa
      console.error('Error al generar la orden');
    }
  } catch (error) {
    console.error('Error al generar la orden:', error);
  }
};


