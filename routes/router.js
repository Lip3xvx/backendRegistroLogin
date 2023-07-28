const express = require('express');
const router = express.Router();
const path = require('path');
const conexion = require('../database/db');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Ruta para obtener el perfil del usuario
router.get('/user/profile', userController.getUserProfile);

// Ruta para el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para procesar el registro de usuario
router.post('/register', authController.register);

// Ruta para el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para procesar el inicio de sesión
router.post('/login', authController.login);

// Ruta para la página de inicio (index)
router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, ''));
});

module.exports = router;
