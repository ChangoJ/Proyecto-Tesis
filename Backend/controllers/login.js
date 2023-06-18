 bcrypt = require('bcryptjs');
 jwt = require('jsonwebtoken');
 User = require('../models/usuario');

 secretKey = 'MRCHANGO&CRISMASTERSON';

var controller = {

  login: async  (req, res) => {
    console.log(req.body)
    let { username, password } = req.body;
                
    try {
      let user = await User.findOne({ $or: [{ username: username }, { ci: username }] });
      if (!user) {
        return res.status(200).json({ message: 'Usuario no encontrado' });
      }
  
      let isPasswordMatch = await bcrypt.compare(password, user.contrasena);
  
      if (!isPasswordMatch) {
        return res.status(200).json({ message: 'Contraseña incorrecta' });
      }
  
      // La contraseña coincide, puedes generar el token de autenticación y enviarlo al cliente
      let token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      res.status(200).json({ message: 'Error en el servidor' });
    }
  }
}

module.exports = controller;