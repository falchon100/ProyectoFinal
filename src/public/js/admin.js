


function deleteUser (email) {
   fetch(`/api/users/deleteUser/${email}`,{
    method:'DELETE',
    headers:{
        'Content-Type': 'application/json'
    }
   })
   .then(response => {
    console.log('Usuario eliminado correctamente');
    window.location.reload();
  })
  .catch(error => {
    console.error('Error en la solicitud fetch:', error);
  });
}

function changeRole(email) {
    alert('cambiado correctamente')
    fetch(`/api/users/changeRole/${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        window.location.reload();
        console.log('Rol cambiado exitosamente');
      } else {
        console.error('Error al cambiar el rol');
      }
    })
    .catch(error => {
      console.error('Error en la solicitud fetch:', error);
    });
  }
  
  function inactiveUser(){
    fetch(`/api/users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        alert('usuarios inactivos eliminados')
        window.location.reload();
        console.log('Usuarios inactivos eliminados correctamente');
      } else {
        console.error('Error al eliminar usuarios inactivos');
      }
    })
    .catch(error => {
      console.error('Error en la solicitud fetch:', error);
    });
  }