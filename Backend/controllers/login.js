bcrypt = require('bcryptjs');
jwt = require('jsonwebtoken');
User = require('../models/usuario');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");

oAuth2Client = new google.auth.OAuth2(
  '106822865384-1v7tmg8aeqssetsttaip63ecrki9epq1.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({
  refresh_token: "1//04Msa02Nn0-LoCgYIARAAGAQSNwF-L9IrC_xF18eDEgpD9v7OcAdgdXmEIRyiKby7nZk40_ldlFNCULRO_CQurXFa3DuyEl0HR6w",
});


secretKey = 'MRCHANGO&CRISMASTERSON';

codigoVerificacion = ""
user = ""
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

var controller = {

  sendCode: async (req, res) => {
    let { username, password } = req.body;
    try {
      user = await User.findOne({ $or: [{ username: username }, { ci: username }] });
      if (!user) {
        return res.status(200).json({ message: 'Usuario no encontrado', status: "error" });
      }

      let isPasswordMatch = await bcrypt.compare(password, user.contrasena);

      if (!isPasswordMatch) {
        return res.status(200).json({ message: 'Contraseña incorrecta', status: "error" });
      }

      // Generar el código de verificación
      codigoVerificacion = generateVerificationCode();

      // Guardar el código de verificación en el usuario
      user.codigoVerificacion = codigoVerificacion;
      await user.save();


      const myAccessToken = await oAuth2Client.getAccessToken()


      // Configurar el transporte de correo electrónico con nodemailer
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'sistemaunibehorarios@gmail.com',
          clientId: '106822865384-1v7tmg8aeqssetsttaip63ecrki9epq1.apps.googleusercontent.com',
          clientSecret: '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',
          refreshToken: "1//04Msa02Nn0-LoCgYIARAAGAQSNwF-L9IrC_xF18eDEgpD9v7OcAdgdXmEIRyiKby7nZk40_ldlFNCULRO_CQurXFa3DuyEl0HR6w",
          accessToken: myAccessToken 
        }
      });
      // Configurar el correo electrónico a enviar
      let mailOptions = {
        from: 'sistemaunibehorarios@gmail.com',
        to: user.email,
        subject: 'Código de verificación para el Sistema de Horarios de clases en la UNIB.E',
        text: `Tu código de verificación es: ${codigoVerificacion}`
      };

      // Enviar el correo electrónico con el código de verificación
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(200).json({ message: 'Error al enviar el código de verificación por correo electrónico', status: "error" });
        } else {
          return res.status(200).json({ message: 'Código de verificación enviado por correo electrónico', status: "success" });
        }
      });

    } catch (error) {
      console.log(error)
      res.status(200).json({ message: 'Error en el servidor', status: "error" });
    }
  },

  verifyCode: async (req, res) => {

    try {
      let { code } = req.body;


      if (user.codigoVerificacion === code) {

        let token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '7d' });

        return res.status(200).json({ message: 'Código de verificación correcto', token: token });

      } else {
        return res.status(200).json({ message: 'Código de verificación incorrecto' });
      }


    } catch (error) {
      res.status(200).json({ message: 'Error en el servidor' });
    }

  }
}
async function getAccessAndRefreshTokens() {
  try {
    const { token, refresh_token } = await oAuth2Client.getAccessToken();
    return { accessToken: token, refreshToken: refresh_token };
  } catch (error) {
    console.log("Error al obtener los tokens:", error);
    return null;
  }
}


module.exports = controller;