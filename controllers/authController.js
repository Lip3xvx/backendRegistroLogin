const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const { promisify } = require('util');
const {resourceLimits}  = require('worker_threads');

// Registro:
exports.register = async (req, res) => {
  try {
    const name = req.body.name;
    const user = req.body.user;
    const pass = req.body.pass;

    // Verificar si el usuario ya existe en la base de datos
    conexion.query(
      'SELECT * FROM users WHERE user = ?',
      [user],
      async (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: 'Error al realizar la consulta' });
        }

        if (results.length > 0) {
          // El usuario ya existe en la base de datos
          return res.status(404).json({ error: 'El usuario ya está registrado' });
        }

        // Hashear la contraseña antes de guardarla en la base de datos
        const passHash = await bcryptjs.hash(pass, 8);

        // Insertar el nuevo usuario en la base de datos
        conexion.query(
          'INSERT INTO users SET ?',
          { user: user, name: name, pass: passHash },
          (error, results) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ error: 'Error al registrar usuario' });
            }

            // Registro exitoso
            res.json({ message: 'Usuario registrado exitosamente' });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};


//login :

exports.login = async (req, res) => {
  try {
    const user = req.body.user;
    const pass = req.body.pass;

    // Realizar la consulta para buscar al usuario en la base de datos
    conexion.query(
      'SELECT * FROM users WHERE user = ?',
      [user],
      async (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: 'Error al realizar la consulta' });
        }

        if (results.length === 0) {
          // El usuario no existe en la base de datos
          return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const passwordMatch = await bcryptjs.compare(pass, results[0].pass);

        if (!passwordMatch) {
          // La contraseña no coincide
          return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar el token JWT para el usuario
        const token = jwt.sign(
          { id: results[0].id, user: results[0].user },
          process.env.JWT_SECRET,
          { expiresIn: '1h' } // El token expirará en 1 hora
        );

        // Envía el token como respuesta al cliente
        res.status(200).json({token: token});
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

