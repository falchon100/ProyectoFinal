import bcrypt from 'bcrypt';

// la funcion recibe el password , y lo hashea con un salt de 10 caracteres
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));

//la funcion recibe el usuario y el password como lo escribe en el front , y compara el password hasheado con el recibido
export const isValidPassword = (user,password) =>bcrypt.compareSync(password,user.password);