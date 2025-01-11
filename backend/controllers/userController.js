import bcrypt from "bcryptjs";
import pool from "../config/db.js"; 

export const verificacionCredencial = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM USUARIOS WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);

  if (!usuario || rowCount === 0) {
    throw { code: 401, message: "Email y/o Contraseña incorrecta" };
  }

  const { password: passwordEncriptada } = usuario;
  const ClaveCorrecta = bcrypt.compareSync(password, passwordEncriptada);

  if (!ClaveCorrecta) {
    throw { code: 401, message: "Email y/o Contraseña incorrecta" };
  }
};

export const registrarUsuario = async (usuario) => {
  let { email, password, rol, lenguage } = usuario;
  try {
    const passwordEncriptada = bcrypt.hashSync(password, 10); 
    const values = [email, passwordEncriptada, rol, lenguage];
    const consulta =
      "INSERT INTO USUARIOS (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
    await pool.query(consulta, values);
  } catch (error) {
    console.log("Error al registrar usuario", error);
    throw {
      code: 500,
      message: "Error al registrar el usuario. Inténtalo nuevamente.",
    };
  }
};
