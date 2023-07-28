// controllers/userController.js

// Importa el módulo 'conexion' si es necesario
const conexion = require('../database/db');
const jwt = require('jsonwebtoken');

// Definir la función getUserProfile
exports.getUserProfile = async (req, res) => {
  try {
    // Obtener el token de la cabecera de la solicitud
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Token de autorización no proporcionado' });
    }

    // Verificar y decodificar el token para obtener el ID de usuario
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: 'Token de autorización inválido' });
      }

      const userId = decodedToken.id;

      // Realizar una consulta a la base de datos para obtener los datos del usuario
      conexion.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Si tienes los datos del usuario, puedes enviarlos como respuesta
        res.json({ user: results[0] });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
  }
};

// Otros métodos del controlador, si los necesitas, pueden ser definidos aquí
// Por ejemplo, puedes tener funciones para actualizar el perfil del usuario, eliminar cuenta, etc.
// Solo asegúrate de exportarlas si las utilizarás en el archivo router.js
